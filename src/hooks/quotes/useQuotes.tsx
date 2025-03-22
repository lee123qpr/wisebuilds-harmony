
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef } from 'react';

// Import utility functions
import { logQuoteFetchDiagnostics, verifyProjectOwnership, logSystemQuotesSample, checkAllProjectQuotes } from './utils/diagnostics';
import { buildQuotesQuery, fetchFreelancerProfiles, createProfileMap } from './utils/queries';
import { formatQuotesWithProfiles } from './utils/formatters';
import { setupQuotesRealtimeListener, removeRealtimeListener } from './utils/realtime';

interface UseQuotesProps {
  projectId?: string;
  forClient?: boolean;
  refreshInterval?: number;
  includeAllQuotes?: boolean;
  excludeCompletedProjects?: boolean;
}

export const useQuotes = ({ 
  projectId, 
  forClient = false,
  refreshInterval = 30000,
  includeAllQuotes = true,  // Default to showing all quotes for clients
  excludeCompletedProjects = false // Default to showing all quotes, including for completed projects
}: UseQuotesProps = {}) => {
  const { user } = useAuth();
  const didLogRef = useRef(false);
  
  // Only log on initial render to reduce console spam
  if (!didLogRef.current) {
    console.log("useQuotes hook called with:", { 
      projectId, 
      forClient, 
      user: user?.id, 
      includeAllQuotes,
      excludeCompletedProjects 
    });
    didLogRef.current = true;
  }
  
  const queryResult = useQuery({
    queryKey: ['quotes', projectId, user?.id, forClient, includeAllQuotes, excludeCompletedProjects],
    queryFn: async (): Promise<QuoteWithFreelancer[]> => {
      if (!user) {
        console.log("No user found, returning empty quotes array");
        return [];
      }
      
      // We need to be able to fetch all accepted quotes for the active jobs view
      // without requiring a specific projectId
      const userType = user.user_metadata?.user_type;
      const isFreelancer = userType === 'freelancer';
      
      try {
        let quotesData;
        
        // For dashboard views where we need all quotes for a user
        if (!projectId) {
          console.log("Fetching all quotes for user:", user.id, "isFreelancer:", isFreelancer);
          
          if (isFreelancer) {
            // For freelancers, get their submitted quotes
            const { data, error } = await supabase
              .from('quotes')
              .select('*, project:projects(*)')
              .eq('freelancer_id', user.id)
              .eq('status', 'accepted'); // Get only accepted quotes for active jobs
              
            if (error) {
              console.error('Error fetching quotes for freelancer:', error);
              throw error;
            }
            
            console.log("Fetched quotes for freelancer:", data?.length);
            quotesData = data;
          } else {
            // For clients, get quotes for their projects
            let query = supabase
              .from('quotes')
              .select('*, project:projects(*)');
              
            // This is a critical change: We need to use client_id to filter 
            // quotes for specific client instead of project.user_id
            query = query.eq('client_id', user.id);
              
            // If we're only looking for accepted quotes
            if (!includeAllQuotes) {
              query = query.eq('status', 'accepted');
            }
              
            // If we want to exclude quotes for completed projects and quotes that are fully completed
            if (excludeCompletedProjects) {
              // First exclude completed projects
              query = query.not('project.status', 'eq', 'completed');
              
              // Then exclude quotes that have been marked as completed by both parties
              query = query.or('freelancer_completed.is.null,client_completed.is.null');
              
              console.log('Excluding quotes for completed projects and fully completed quotes');
            }
              
            const { data, error } = await query;
            
            if (error) {
              console.error('Error fetching quotes for client:', error);
              throw error;
            }
            
            console.log("Fetched quotes for client:", data?.length);
            quotesData = data;
          }
        } else {
          // If we have a projectId, use the existing query building logic
          // Log diagnostics for quote fetching
          logQuoteFetchDiagnostics(projectId, forClient, user.id, includeAllQuotes);
          
          // Build and execute the main quotes query
          const query = buildQuotesQuery(projectId, forClient, user.id, includeAllQuotes, excludeCompletedProjects);
          const { data, error } = await query;
          
          if (error) {
            console.error('Error fetching quotes:', error);
            throw error;
          }
          
          quotesData = data;
          
          // If no quotes were found with the initial query
          if (!quotesData || quotesData.length === 0) {
            // Check if there are any quotes for this project
            if (projectId) {
              const allProjectQuotes = await checkAllProjectQuotes(projectId);
              
              // If we should include all quotes, use these results instead
              if (includeAllQuotes && allProjectQuotes && allProjectQuotes.length > 0) {
                console.log('Using all quotes found due to includeAllQuotes=true');
                quotesData = allProjectQuotes;
              }
            }
          }
        }
        
        if (!quotesData || quotesData.length === 0) {
          console.log("No quotes found, returning empty array");
          return [];
        }
        
        console.log(`Found ${quotesData.length} quotes:`, quotesData);
        
        // Fetch freelancer profiles for these quotes
        const freelancerIds = quotesData.map(quote => quote.freelancer_id);
        const freelancerProfiles = await fetchFreelancerProfiles(freelancerIds);
        
        // Create a map of freelancer profiles by ID for quick lookup
        const profileMap = createProfileMap(freelancerProfiles);
        
        // Combine quotes with freelancer profiles
        const result = formatQuotesWithProfiles(quotesData, profileMap);
        
        return result;
      } catch (error) {
        console.error('Error in useQuotes query function:', error);
        throw error;
      }
    },
    enabled: !!user, // Only run query if we have a user
    refetchInterval: refreshInterval,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });

  // Set up real-time listener for quotes table
  useEffect(() => {
    if (!user?.id) return;
    
    // Set up a more comprehensive realtime listener
    const channel = supabase
      .channel(`quotes-changes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'quotes',
          filter: `client_id=eq.${user.id}`, // Filter by client_id for client dashboard
        },
        (payload) => {
          console.log('Real-time quote update received:', payload);
          // Force refetch the data when quotes change
          queryResult.refetch();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status for quotes:', status);
      });

    // Cleanup function to remove the listener when component unmounts
    return () => {
      console.log('Removing realtime listener for quotes');
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryResult.refetch]);

  return {
    ...queryResult,
    isError: queryResult.isError,
    error: queryResult.error
  };
};
