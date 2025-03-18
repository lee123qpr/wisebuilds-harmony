
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';

interface UseFreelancerQuoteProps {
  projectId: string;
}

export const useFreelancerQuote = ({ projectId }: UseFreelancerQuoteProps) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quote', projectId, user?.id],
    queryFn: async (): Promise<Quote | null> => {
      if (!user) return null;

      console.log('Fetching quote for project:', projectId, 'and freelancer:', user.id);
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching quote:', error);
        throw error;
      }
      
      if (!data) return null;
      
      // Validate that the status is one of the expected values
      const validStatuses: Quote['status'][] = ['pending', 'accepted', 'declined'];
      const status = validStatuses.includes(data.status as Quote['status']) 
        ? (data.status as Quote['status']) 
        : 'pending'; // Default to pending if somehow an invalid status is received
      
      // Return the data with the validated status
      return {
        ...data,
        status,
      } as Quote;
    },
    enabled: !!user && !!projectId,
  });
};
