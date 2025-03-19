
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseQuotesProps {
  projectId?: string;
  forClient?: boolean;
  refreshInterval?: number;
}

export const useQuotes = ({ 
  projectId, 
  forClient = false, 
  refreshInterval = 30000 
}: UseQuotesProps = {}) => {
  const { user } = useAuth();
  
  console.log("useQuotes hook called with:", { projectId, forClient, user: user?.id });
  
  const queryResult = useQuery({
    queryKey: ['quotes', projectId, user?.id, forClient],
    queryFn: async (): Promise<QuoteWithFreelancer[]> => {
      if (!user) {
        console.log("No user found, returning empty quotes array");
        return [];
      }
      
      console.log('------------- QUOTE FETCH DIAGNOSTICS START -------------');
      console.log('Fetching quotes for', forClient ? 'client' : 'freelancer', 'with projectId:', projectId);
      console.log('User ID:', user.id);
      console.log('User metadata:', user.user_metadata);
      
      // First, let's check if the project exists and belongs to the user if forClient is true
      if (forClient && projectId) {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, user_id')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          console.error('Error verifying project ownership:', projectError);
        } else {
          console.log('Project data:', projectData);
          if (projectData.user_id !== user.id) {
            console.warn('Project does not belong to current user. Project user_id:', projectData.user_id, 'Current user_id:', user.id);
          }
        }
      }
      
      // First, get the quotes
      let query = supabase
        .from('quotes')
        .select('*');
      
      // If projectId is provided, filter by that project
      if (projectId) {
        query = query.eq('project_id', projectId);
        console.log('Filtering by project_id:', projectId);
      }
      
      // Filter by client_id or freelancer_id depending on forClient
      if (forClient) {
        query = query.eq('client_id', user.id);
        console.log('Filtering by client_id:', user.id);
      } else {
        query = query.eq('freelancer_id', user.id);
        console.log('Filtering by freelancer_id:', user.id);
      }
      
      console.log('Query parameters:', query);
      
      // Execute the quotes query
      const { data: quotesData, error: quotesError } = await query;
      
      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        throw quotesError;
      }
      
      console.log('Quotes data directly from database:', quotesData);
      
      if (!quotesData || quotesData.length === 0) {
        // Try one more query without the client_id filter to see if there are any quotes at all for this project
        if (forClient && projectId) {
          console.log('No quotes found with client_id filter. Trying without client filter...');
          const { data: allQuotesData, error: allQuotesError } = await supabase
            .from('quotes')
            .select('*')
            .eq('project_id', projectId);
            
          if (!allQuotesError && allQuotesData) {
            console.log('All quotes for this project (ignoring client filter):', allQuotesData);
            if (allQuotesData.length > 0) {
              console.log('Found quotes for this project but not associated with this client');
              console.log('Quote client_ids:', allQuotesData.map(q => q.client_id));
              console.log('Current user id:', user.id);
              
              // Check if any quotes match by user_id instead of client_id (might be a data issue)
              const matchesByUserId = allQuotesData.filter(q => q.client_id === user.id).length;
              if (matchesByUserId > 0) {
                console.log(`Found ${matchesByUserId} quotes matching user_id instead of client_id`);
              }
            } else {
              console.log('No quotes found for this project at all');
            }
          }
          
          // Try one more query to check ALL quotes in the system
          console.log('Checking if there are ANY quotes in the system:');
          const { data: systemQuotes, error: systemError } = await supabase
            .from('quotes')
            .select('*')
            .limit(10);
            
          if (!systemError) {
            console.log('Sample of quotes in the system:', systemQuotes);
            if (systemQuotes && systemQuotes.length > 0) {
              const projects = [...new Set(systemQuotes.map(q => q.project_id))];
              const clients = [...new Set(systemQuotes.map(q => q.client_id))];
              console.log('Projects with quotes:', projects);
              console.log('Clients with quotes:', clients);
            }
          }
        }
        console.log('------------- QUOTE FETCH DIAGNOSTICS END -------------');
        return [];
      }
      
      // Now get the freelancer profiles for these quotes
      const freelancerIds = quotesData.map(quote => quote.freelancer_id);
      
      const { data: freelancerProfiles, error: profilesError } = await supabase
        .from('freelancer_profiles')
        .select('id, first_name, last_name, display_name, profile_photo, job_title, rating')
        .in('id', freelancerIds);
      
      if (profilesError) {
        console.error('Error fetching freelancer profiles:', profilesError);
        // Continue without profiles rather than failing completely
      }
      
      console.log('Freelancer profiles data:', freelancerProfiles);
      
      // Create a map of freelancer profiles by ID for quick lookup
      const profileMap = (freelancerProfiles || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);
      
      // Combine quotes with freelancer profiles
      const result = quotesData.map(quote => {
        const freelancerProfile = profileMap[quote.freelancer_id] || {};
        
        return {
          ...quote,
          status: quote.status as QuoteWithFreelancer['status'],
          duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
          quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
          freelancer_profile: {
            first_name: freelancerProfile.first_name,
            last_name: freelancerProfile.last_name,
            display_name: freelancerProfile.display_name,
            profile_photo: freelancerProfile.profile_photo,
            job_title: freelancerProfile.job_title,
            rating: freelancerProfile.rating,
          }
        };
      });
      
      console.log('Final processed quotes with profiles:', result);
      console.log('------------- QUOTE FETCH DIAGNOSTICS END -------------');
      return result;
    },
    enabled: !!user,
    refetchInterval: refreshInterval, // Regularly refresh data
    refetchOnWindowFocus: true, // Also refresh when window gets focus
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  // Set up real-time listener for quotes table
  useEffect(() => {
    if (!user || !projectId) return;

    console.log('Setting up real-time listener for quotes table with projectId:', projectId);
    
    // Create a channel for real-time updates
    const channel = supabase
      .channel(`quotes-changes-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'quotes',
          filter: projectId ? `project_id=eq.${projectId}` : undefined,
        },
        (payload) => {
          console.log('Real-time quote update received:', payload);
          // Force refetch the data when quotes change
          queryResult.refetch();
          // Show toast notification for new quote
          if (payload.eventType === 'INSERT' && forClient) {
            toast.success('New quote received!', {
              description: 'A freelancer has submitted a new quote for your project.'
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup function to remove the listener when component unmounts
    return () => {
      console.log('Removing real-time listener for quotes');
      supabase.removeChannel(channel);
    };
  }, [projectId, user, queryResult.refetch, forClient]);

  return {
    ...queryResult,
    isError: queryResult.isError,
    error: queryResult.error
  };
};
