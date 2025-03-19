
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

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
  
  const queryResult = useQuery({
    queryKey: ['quotes', projectId, user?.id, forClient],
    queryFn: async (): Promise<QuoteWithFreelancer[]> => {
      if (!user) return [];
      
      // First, get the quotes
      let query = supabase
        .from('quotes')
        .select('*');
      
      // If projectId is provided, filter by that project
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      // Filter by client_id or freelancer_id depending on forClient
      if (forClient) {
        query = query.eq('client_id', user.id);
      } else {
        query = query.eq('freelancer_id', user.id);
      }
      
      // Execute the quotes query
      const { data: quotesData, error: quotesError } = await query;
      
      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        throw quotesError;
      }
      
      if (!quotesData || quotesData.length === 0) {
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
      
      // Create a map of freelancer profiles by ID for quick lookup
      const profileMap = (freelancerProfiles || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);
      
      // Combine quotes with freelancer profiles
      return quotesData.map(quote => {
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
    },
    enabled: !!user,
    refetchInterval: refreshInterval, // Regularly refresh data
    refetchOnWindowFocus: true, // Also refresh when window gets focus
  });

  // Set up real-time listener for quotes table
  useEffect(() => {
    if (!user || !projectId) return;

    console.log('Setting up real-time listener for quotes table');
    
    // Create a channel for real-time updates
    const channel = supabase
      .channel('quotes-changes')
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
        }
      )
      .subscribe();

    // Cleanup function to remove the listener when component unmounts
    return () => {
      console.log('Removing real-time listener for quotes');
      supabase.removeChannel(channel);
    };
  }, [projectId, user, queryResult.refetch]);

  return queryResult;
};
