
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
  includeAllQuotes?: boolean; // New parameter to optionally bypass client filtering
}

export const useQuotes = ({ 
  projectId, 
  forClient = false,
  refreshInterval = 30000,
  includeAllQuotes = false // Default to false to maintain backward compatibility
}: UseQuotesProps = {}) => {
  const { user } = useAuth();
  
  console.log("useQuotes hook called with:", { projectId, forClient, user: user?.id, includeAllQuotes });
  
  const queryResult = useQuery({
    queryKey: ['quotes', projectId, user?.id, forClient, includeAllQuotes],
    queryFn: async (): Promise<QuoteWithFreelancer[]> => {
      if (!user) {
        console.log("No user found, returning empty quotes array");
        return [];
      }
      
      console.log('------------- QUOTE FETCH DIAGNOSTICS START -------------');
      console.log('Fetching quotes for', forClient ? 'client' : 'freelancer', 'with projectId:', projectId);
      console.log('User ID:', user.id);
      console.log('User metadata:', user.user_metadata);
      console.log('Include all quotes (bypass client filter):', includeAllQuotes);
      
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
      // Unless includeAllQuotes is true, which bypasses the client filter for diagnostics
      if (!includeAllQuotes) {
        if (forClient) {
          query = query.eq('client_id', user.id);
          console.log('Filtering by client_id:', user.id);
        } else {
          query = query.eq('freelancer_id', user.id);
          console.log('Filtering by freelancer_id:', user.id);
        }
      } else {
        console.log('Bypassing client/freelancer filter to see all quotes for this project');
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
        // Always check all quotes for this project for diagnostic purposes
        if (projectId) {
          console.log('Checking ALL quotes for this project regardless of client_id...');
          const { data: allQuotesData, error: allQuotesError } = await supabase
            .from('quotes')
            .select('*, client:client_id(*), freelancer:freelancer_id(*)')
            .eq('project_id', projectId);
            
          if (!allQuotesError && allQuotesData && allQuotesData.length > 0) {
            console.log('Found quotes for this project but with different filter criteria:', allQuotesData);
            console.log('Quote client_ids:', allQuotesData.map(q => q.client_id));
            console.log('Quote freelancer_ids:', allQuotesData.map(q => q.freelancer_id));
            console.log('Current user id:', user.id);
            
            // If includeAllQuotes is true, use these results instead
            if (includeAllQuotes) {
              console.log('Using all quotes found due to includeAllQuotes=true');
              
              // We've already joined the freelancer info in the query, just need to format it
              const formattedQuotes = allQuotesData.map(quote => {
                return {
                  ...quote,
                  status: quote.status as QuoteWithFreelancer['status'],
                  duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
                  quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
                  freelancer_profile: quote.freelancer ? {
                    id: quote.freelancer.id,
                    first_name: quote.freelancer.first_name,
                    last_name: quote.freelancer.last_name,
                    display_name: quote.freelancer.display_name,
                    profile_photo: quote.freelancer.profile_photo,
                    job_title: quote.freelancer.job_title,
                    rating: quote.freelancer.rating,
                  } : {}
                };
              });
              
              console.log('Returning all quotes for project:', formattedQuotes);
              console.log('------------- QUOTE FETCH DIAGNOSTICS END -------------');
              return formattedQuotes;
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
