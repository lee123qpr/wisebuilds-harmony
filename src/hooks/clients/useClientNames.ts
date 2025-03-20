
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';

export function useClientNames(jobs: QuoteWithFreelancer[]) {
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClientNames = async () => {
      if (!jobs.length) return;
      
      setIsLoading(true);
      const clientIds = jobs.map(job => job.client_id).filter(Boolean);
      
      // Skip if no client IDs to fetch
      if (!clientIds.length) {
        setIsLoading(false);
        return;
      }
      
      // Fetch client profiles for client names
      for (const clientId of clientIds) {
        // Skip if we already have this client's name
        if (clientNames[clientId]) continue;
        
        const { data } = await supabase.functions.invoke(
          'get-user-profile',
          { body: { userId: clientId } }
        );
        
        if (data) {
          const metadata = data.user_metadata || {};
          const displayName = metadata.contact_name || metadata.full_name || 'Client';
          
          setClientNames(prev => ({
            ...prev,
            [clientId]: displayName
          }));
        }
      }
      
      setIsLoading(false);
    };
    
    fetchClientNames();
  }, [jobs]);

  return { clientNames, isLoading };
}
