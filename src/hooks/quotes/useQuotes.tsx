
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

// Import utility functions
import { logQuoteFetchDiagnostics, verifyProjectOwnership, logSystemQuotesSample, checkAllProjectQuotes } from './utils/diagnostics';
import { buildQuotesQuery, fetchFreelancerProfiles, createProfileMap } from './utils/queries';
import { formatQuotesWithProfiles, formatDirectQuotesWithFreelancers } from './utils/formatters';
import { setupQuotesRealtimeListener, removeRealtimeListener } from './utils/realtime';

interface UseQuotesProps {
  projectId?: string;
  forClient?: boolean;
  refreshInterval?: number;
  includeAllQuotes?: boolean;
}

export const useQuotes = ({ 
  projectId, 
  forClient = false,
  refreshInterval = 30000,
  includeAllQuotes = false
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
      
      // Log diagnostics for quote fetching
      logQuoteFetchDiagnostics(projectId, forClient, user.id, includeAllQuotes);
      
      // Verify project ownership if needed
      if (forClient && projectId) {
        await verifyProjectOwnership(projectId, user.id);
      }
      
      // Build and execute the main quotes query
      const query = buildQuotesQuery(projectId, forClient, user.id, includeAllQuotes);
      const { data: quotesData, error: quotesError } = await query;
      
      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        throw quotesError;
      }
      
      console.log('Quotes data directly from database:', quotesData);
      
      // If no quotes were found with the initial query
      if (!quotesData || quotesData.length === 0) {
        // Check if there are any quotes for this project
        if (projectId) {
          const allProjectQuotes = await checkAllProjectQuotes(projectId);
          
          // If includeAllQuotes is true, use these results instead
          if (includeAllQuotes && allProjectQuotes && allProjectQuotes.length > 0) {
            console.log('Using all quotes found due to includeAllQuotes=true');
            return formatDirectQuotesWithFreelancers(allProjectQuotes);
          }
        }
        
        // Log system-wide quotes for diagnostics
        await logSystemQuotesSample();
        return [];
      }
      
      // Fetch freelancer profiles for these quotes
      const freelancerIds = quotesData.map(quote => quote.freelancer_id);
      const freelancerProfiles = await fetchFreelancerProfiles(freelancerIds);
      
      // Create a map of freelancer profiles by ID for quick lookup
      const profileMap = createProfileMap(freelancerProfiles);
      
      // Combine quotes with freelancer profiles
      const result = formatQuotesWithProfiles(quotesData, profileMap);
      
      console.log('Final processed quotes with profiles:', result);
      console.log('------------- QUOTE FETCH DIAGNOSTICS END -------------');
      return result;
    },
    enabled: !!user,
    refetchInterval: refreshInterval,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });

  // Set up real-time listener for quotes table
  useEffect(() => {
    const channel = setupQuotesRealtimeListener(
      projectId || '', 
      user?.id, 
      forClient, 
      queryResult.refetch
    );

    // Cleanup function to remove the listener when component unmounts
    return () => {
      removeRealtimeListener(channel);
    };
  }, [projectId, user, queryResult.refetch, forClient]);

  return {
    ...queryResult,
    isError: queryResult.isError,
    error: queryResult.error
  };
};
