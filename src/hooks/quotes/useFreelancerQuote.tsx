
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
      
      return data;
    },
    enabled: !!user && !!projectId,
  });
};
