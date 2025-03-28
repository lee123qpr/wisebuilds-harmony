
export { setupVerification } from './verification-setup';
export { fetchVerificationStatus } from './verification-status';
export { uploadVerificationDocument } from './document-upload';
export { deleteVerificationDocument } from './document-deletion';
export { getVerificationBucketName } from './storage-utils';
export { mapDatabaseStatusToVerificationStatus } from './status-utils';

/**
 * Helper function to check if a user is verified
 */
export const isUserVerified = async (userId: string): Promise<boolean> => {
  try {
    const verificationData = await fetchVerificationStatus(userId);
    return verificationData?.status === 'verified';
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
};

/**
 * Helper function to get a user's verification status
 */
export const getUserVerificationStatus = async (userId: string): Promise<string> => {
  try {
    const verificationData = await fetchVerificationStatus(userId);
    return verificationData?.status || 'not_submitted';
  } catch (error) {
    console.error('Error getting verification status:', error);
    return 'not_submitted';
  }
};

/**
 * Helper function to check if a user is a freelancer
 */
export const isUserFreelancer = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking if user is freelancer:', error);
    return false;
  }
};
