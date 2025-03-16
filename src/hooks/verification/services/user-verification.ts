
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if current user is a freelancer
 * This function uses multiple methods to verify the user type:
 * 1. First checks user metadata
 * 2. Then checks for freelancer credits record
 * 3. Finally checks if there's no client profile record
 * 
 * @returns {Promise<boolean>} True if user is a freelancer, false otherwise
 */
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      console.log('No active session found');
      return false;
    }
    
    const userId = session.user.id;
    console.log('Checking if user is freelancer:', userId);
    
    // First check user metadata for quick verification
    if (session.user.user_metadata?.user_type === 'freelancer') {
      console.log('User verified as freelancer via metadata');
      return true;
    }
    
    // Check if there's a freelancer_credits record which only exists for freelancers
    const { data: freelancerCredits, error: creditsError } = await supabase
      .from('freelancer_credits')
      .select('credit_balance')
      .eq('user_id', userId)
      .single();
      
    if (creditsError) {
      console.log('Error checking freelancer credits:', creditsError.message);
    }
    
    if (freelancerCredits) {
      console.log('User verified as freelancer via credits record');
      return true;
    }
    
    // As a fallback, check if there's a client_profiles record
    // If there is a client_profiles record, the user is not a freelancer
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (clientError) {
      console.log('Error checking client profile:', clientError.message);
    }
    
    // If user is explicitly marked as business, they're not a freelancer
    if (session.user.user_metadata?.user_type === 'business') {
      console.log('User identified as business via metadata');
      return false;
    }
    
    // If no client profile exists and user isn't explicitly marked as business,
    // we assume they might be a freelancer with incomplete setup
    const isFreelancer = !clientProfile;
    console.log('Fallback freelancer check result:', isFreelancer);
    return isFreelancer;
    
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};

/**
 * Helper function to check if the id-documents storage bucket is accessible
 * This can be used to verify if setup has been correctly done
 */
export const checkIdDocumentsBucketAccess = async (): Promise<boolean> => {
  try {
    // Get current user ID to use for proper folder path prefix
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      console.error('No active session found while checking bucket access');
      return false;
    }
    
    const userId = session.user.id;
    
    // Try to list files in the user's own folder (which should always be allowed)
    // This is more accurate than listing the root of the bucket
    const { data, error } = await supabase.storage
      .from('id-documents')
      .list(userId, { limit: 1 });
    
    if (error) {
      // Check if it's an access error or if the folder doesn't exist yet by checking the error message
      const isNotFoundError = error.message.includes('The resource was not found') || 
                             error.message.includes('Object not found');
                             
      if (isNotFoundError) {
        // This is normal for new users - folder doesn't exist yet
        console.log('Folder not found, but bucket is accessible');
        return true;
      }
      
      console.error('Error accessing id-documents bucket:', error);
      return false;
    }
    
    console.log('Successfully accessed id-documents bucket');
    return true;
  } catch (error) {
    console.error('Error checking id-documents bucket access:', error);
    return false;
  }
};
