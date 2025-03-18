
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { QuoteWithFreelancer } from '@/types/quotes';

interface UseQuoteDetailsProps {
  projectId?: string;
  quoteId?: string;
}

export const useQuoteDetails = ({ projectId, quoteId }: UseQuoteDetailsProps) => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['quote', projectId, quoteId, user?.id],
    queryFn: async () => {
      if (!user || !projectId || !quoteId) {
        return null;
      }

      console.log('Fetching quote details:', quoteId);
      
      // Fetch the quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('project_id', projectId)
        .maybeSingle();
      
      if (quoteError) {
        console.error('Error fetching quote:', quoteError);
        throw quoteError;
      }
      
      if (!quote) {
        return null;
      }
      
      // Fetch the freelancer profile
      const { data: freelancer, error: freelancerError } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', quote.freelancer_id)
        .maybeSingle();
      
      if (freelancerError) {
        console.error('Error fetching freelancer profile:', freelancerError);
      }
      
      // Fetch the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();
      
      if (projectError) {
        console.error('Error fetching project:', projectError);
      }
      
      // Validate that the status is one of the expected values
      const validStatuses: QuoteWithFreelancer['status'][] = ['pending', 'accepted', 'declined'];
      const status = validStatuses.includes(quote.status as QuoteWithFreelancer['status']) 
        ? (quote.status as QuoteWithFreelancer['status']) 
        : 'pending';
      
      return {
        quote: {
          ...quote,
          status,
        } as QuoteWithFreelancer,
        freelancer,
        project,
      };
    },
    enabled: !!user && !!projectId && !!quoteId,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return {
    quote: data?.quote || null,
    freelancer: data?.freelancer || null,
    project: data?.project || null,
    isLoading,
    error,
  };
};
