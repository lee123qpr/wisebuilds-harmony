
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast as toastFunction } from '@/hooks/use-toast';

export async function fetchFreelancerProfileData(
  user: User | null, 
  setIsLoading: (loading: boolean) => void,
  toast: typeof toastFunction
) {
  if (!user) return null;
  
  try {
    setIsLoading(true);
    
    // Fetch the freelancer profile data
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      throw profileError;
    }
    
    // Check if we need to fetch the rating information
    if (profileData) {
      try {
        // Attempt to get rating data from client_reviews if it's not already present
        if (profileData.rating === undefined || profileData.rating === null) {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('client_reviews')
            .select('rating')
            .eq('client_id', user.id);
            
          if (!reviewsError && reviewsData && reviewsData.length > 0) {
            // Calculate average rating
            const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
            profileData.rating = parseFloat((totalRating / reviewsData.length).toFixed(1));
            profileData.reviews_count = reviewsData.length;
          }
        }
      } catch (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        // Continue with profile data even if reviews fetch fails
      }
    }
    
    console.log('Loaded profile data from database:', profileData);
    
    return profileData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to load profile information.',
    });
    return null;
  } finally {
    setIsLoading(false);
  }
}
