
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';

export function useFreelancerNames(jobs: QuoteWithFreelancer[]) {
  const [freelancerNames, setFreelancerNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFreelancerNames = async () => {
      if (!jobs.length) return;
      
      setIsLoading(true);
      const freelancerIds = jobs.map(job => job.freelancer_id).filter(Boolean);
      
      // Skip if no freelancer IDs to fetch
      if (!freelancerIds.length) {
        setIsLoading(false);
        return;
      }
      
      // Fetch freelancer profiles for names
      for (const freelancerId of freelancerIds) {
        // Skip if we already have this freelancer's name
        if (freelancerNames[freelancerId]) continue;
        
        const { data } = await supabase.functions.invoke(
          'get-user-profile',
          { body: { userId: freelancerId } }
        );
        
        if (data) {
          const metadata = data.user_metadata || {};
          const displayName = metadata.display_name || 
                             (metadata.first_name && metadata.last_name ? 
                              `${metadata.first_name} ${metadata.last_name}` : 
                              'Freelancer');
          
          setFreelancerNames(prev => ({
            ...prev,
            [freelancerId]: displayName
          }));
        }
      }
      
      setIsLoading(false);
    };
    
    fetchFreelancerNames();
  }, [jobs]);

  return { freelancerNames, isLoading };
}
