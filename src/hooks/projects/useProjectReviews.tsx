
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseProjectReviewsProps {
  projectId?: string;
  quoteId?: string;
  reviewerId?: string;
  revieweeId?: string;
}

export const useProjectReviews = ({
  projectId,
  quoteId,
  reviewerId,
  revieweeId
}: UseProjectReviewsProps = {}) => {
  return useQuery({
    queryKey: ['reviews', { projectId, quoteId, reviewerId, revieweeId }],
    queryFn: async () => {
      // Build the query based on provided filters
      let query = supabase
        .from('reviews')
        .select(`
          *,
          reviewer:reviewer_id(
            id,
            user_metadata->>display_name,
            user_metadata->>first_name,
            user_metadata->>last_name,
            user_metadata->>profile_image_url,
            user_metadata->>user_type
          ),
          reviewee:reviewee_id(
            id,
            user_metadata->>display_name,
            user_metadata->>first_name,
            user_metadata->>last_name,
            user_metadata->>profile_image_url,
            user_metadata->>user_type
          )
        `);
      
      // Apply filters if provided
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      if (quoteId) {
        query = query.eq('quote_id', quoteId);
      }
      
      if (reviewerId) {
        query = query.eq('reviewer_id', reviewerId);
      }
      
      if (revieweeId) {
        query = query.eq('reviewee_id', revieweeId);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    enabled: !!(projectId || quoteId || reviewerId || revieweeId)
  });
};
