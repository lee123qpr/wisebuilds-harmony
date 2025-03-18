
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithFreelancer } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';

interface UseQuotesProps {
  projectId?: string;
  forClient?: boolean;
}

export const useQuotes = ({ projectId, forClient = false }: UseQuotesProps = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['quotes', projectId, user?.id, forClient],
    queryFn: async (): Promise<QuoteWithFreelancer[]> => {
      if (!user) return [];
      
      let query = supabase
        .from('quotes')
        .select(`
          *,
          freelancer_profile:freelancer_id(
            first_name,
            last_name,
            display_name,
            profile_photo,
            job_title,
            rating,
            verified
          )
        `);
      
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
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching quotes:', error);
        throw error;
      }
      
      // Transform the data to ensure proper typing
      return (data || []).map(quote => {
        return {
          ...quote,
          status: quote.status as QuoteWithFreelancer['status'],
          duration_unit: quote.duration_unit as QuoteWithFreelancer['duration_unit'],
          quote_files: Array.isArray(quote.quote_files) ? quote.quote_files : [],
          freelancer_profile: quote.freelancer_profile || {}
        };
      });
    },
    enabled: !!user,
  });
};
