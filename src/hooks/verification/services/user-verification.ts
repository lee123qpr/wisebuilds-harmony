
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
 * 
 * IMPORTANT: This function doesn't check if the user can actually upload files,
 * just if the bucket exists and is accessible for listing
 */
export const checkIdDocumentsBucketAccess = async (): Promise<boolean> => {
  try {
    // First check if the bucket exists at all by trying to get its public URL
    // This is a lightweight operation that doesn't require specific permissions
    const { data: bucketData } = await supabase
      .storage
      .getBucket('id-documents');
    
    if (!bucketData) {
      console.error('id-documents bucket does not exist');
      return false;
    }
    
    console.log('id-documents bucket exists, checking access permissions');
    
    // Try using a basic operation that should always work if the bucket is 
    // properly set up and the user has anonymous access
    try {
      // getPublicUrl doesn't return an error property, so we need to handle this differently
      const { data } = await supabase.storage
        .from('id-documents')
        .getPublicUrl('test.txt');
      
      console.log('Public URL test completed');
    } catch (e) {
      // Ignore errors for this operation as we're just testing
      console.log('Error in public URL test, but continuing:', e);
    }
    
    // Now we need to check if we can run the setup function again
    try {
      // Make an API call to our setup function to ensure the bucket is properly configured
      const response = await fetch('/api/setup-verification');
      if (!response.ok) {
        console.warn('Setup verification API call failed, but continuing');
      }
    } catch (setupError) {
      console.warn('Error calling setup function:', setupError);
      // Continue anyway as this is just a precaution
    }
    
    return true;
  } catch (error) {
    console.error('Error checking id-documents bucket access:', error);
    return false;
  }
};
