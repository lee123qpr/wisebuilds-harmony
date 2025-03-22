
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef } from 'react';

// Import utility functions from our newly created files
import { fetchQuotesData } from './utils/quoteFetching';
import { setupRealtimeListener } from './utils/realtimeListeners';

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
      
      return fetchQuotesData({
        user, 
        projectId, 
        forClient, 
        includeAllQuotes, 
        excludeCompletedProjects
      });
    },
    enabled: !!user, // Only run query if we have a user
    refetchInterval: refreshInterval,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });

  // Set up real-time listener for quotes table
  useEffect(() => {
    if (!user?.id) return;
    
    console.log('Setting up enhanced realtime listener for quotes in useQuotes hook');
    
    // Set up a more comprehensive realtime listener
    const channel = setupRealtimeListener(user.id, queryResult.refetch);

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
