
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { QuoteWithFreelancer } from '@/types/quotes';
import { getFreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';

interface UseQuoteDetailsProps {
  projectId?: string;
  quoteId?: string;
}

export const useQuoteDetails = ({ projectId, quoteId }: UseQuoteDetailsProps) => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quote', projectId, quoteId, user?.id],
    queryFn: async () => {
      if (!user || !projectId || !quoteId) {
        return null;
      }

      console.log('Fetching quote details:', quoteId);
      
      // Fetch the quote directly from database with no caching
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
        console.log('No quote found with ID:', quoteId);
        return null;
      }
      
      console.log('Quote data from database:', quote);
      
      // Fetch the freelancer profile
      const { data: freelancer, error: freelancerError } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', quote.freelancer_id)
        .maybeSingle();
      
      if (freelancerError) {
        console.error('Error fetching freelancer profile:', freelancerError);
      }
      
      // If no freelancer profile found, get fallback info
      let freelancerData = freelancer;
      if (!freelancerData || Object.keys(freelancerData).length === 0) {
        try {
          const freelancerInfo = await getFreelancerInfo(quote.freelancer_id);
          if (freelancerInfo) {
            // We need to create a partial freelancer profile with the info we have
            // since the database expects a full freelancer_profiles row
            freelancerData = {
              id: quote.freelancer_id,
              // Required fields with defaults
              accreditations: null,
              availability: '',
              bio: '',
              created_at: new Date().toISOString(),
              display_name: freelancerInfo.full_name || 'Freelancer',
              email: freelancerInfo.email || '',
              experience: '',
              first_name: '',
              hourly_rate: '',
              job_title: 'Freelancer',
              last_name: '',
              location: freelancerInfo.location || '',
              member_since: freelancerInfo.member_since || new Date().toISOString(),
              phone_number: freelancerInfo.phone_number || '',
              profile_photo: freelancerInfo.profile_image || '',
              skills: null,
              updated_at: new Date().toISOString(),
              website: '',
              indemnity_insurance: null,
              previous_employers: null,
              previous_work: null,
              jobs_completed: freelancerInfo.jobs_completed || 0,
              rating: freelancerInfo.rating || null,
              reviews_count: freelancerInfo.reviews_count || 0,
              qualifications: null,
              id_verified: freelancerInfo.verified || false
            };
          }
        } catch (err) {
          console.error('Error fetching fallback freelancer info:', err);
        }
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
        freelancer: freelancerData,
        project,
      };
    },
    enabled: !!user && !!projectId && !!quoteId,
    refetchInterval: 2000, // Refresh every 2 seconds for more responsive UI
    staleTime: 0, // Consider data always stale to ensure we get fresh data
    refetchOnWindowFocus: true, // Refetch when window gains focus
    gcTime: 0, // Use gcTime instead of cacheTime (renamed in React Query v5)
  });

  return {
    quote: data?.quote || null,
    freelancer: data?.freelancer || null,
    project: data?.project || null,
    isLoading,
    error,
    refetch,
  };
};
