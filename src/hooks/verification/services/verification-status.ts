
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';

/**
 * Fetches verification status for a user
 */
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    // Get the verification record for the user
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      throw error;
    }
    
    console.log('Fetched verification status:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    return null;
  }
};

/**
 * Deletes verification document for a user
 */
export const deleteVerificationDocument = async (
  userId: string,
  documentPath: string
): Promise<{ 
  success: boolean;
  error?: any;
}> => {
  try {
    console.log('Deleting document for user:', userId, 'path:', documentPath);
    
    // First, update the verification record
    const { error: updateError } = await supabase
      .from('freelancer_verification')
      .update({
        document_path: null,
        document_name: null,
        document_size: null,
        document_type: null,
        status: 'not_submitted',
        admin_notes: null,
        submitted_at: null,
        reviewed_at: null
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating verification record:', updateError);
      return { 
        success: false, 
        error: updateError 
      };
    }
    
    // Then, delete the file from storage
    const bucketName = await getVerificationBucketName();
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([documentPath]);
    
    if (deleteError) {
      console.error('Error deleting file from storage:', deleteError);
      return { 
        success: false, 
        error: deleteError 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteVerificationDocument:', error);
    return { 
      success: false, 
      error 
    };
  }
};

/**
 * Checks if a user is verified
 */
export const isUserVerified = async (userId: string): Promise<boolean> => {
  try {
    const data = await fetchVerificationStatus(userId);
    return data?.status === 'verified';
  } catch (error) {
    console.error('Error in isUserVerified:', error);
    return false;
  }
};

/**
 * Gets user verification status
 */
export const getUserVerificationStatus = async (userId: string): Promise<string> => {
  try {
    const data = await fetchVerificationStatus(userId);
    return data?.status || 'not_submitted';
  } catch (error) {
    console.error('Error in getUserVerificationStatus:', error);
    return 'not_submitted';
  }
};

/**
 * Determines which verification bucket to use
 */
export const getVerificationBucketName = async (): Promise<string> => {
  // Check available buckets
  const { data: bucketsData, error: bucketsError } = await supabase.storage
    .listBuckets();
  
  if (bucketsError) {
    console.error('Error checking buckets:', bucketsError);
  }
  
  console.log('Available buckets:', bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none');
  
  // Check if verification_documents or verification-documents exists
  const bucketWithUnderscore = bucketsData?.find(b => b.name === 'verification_documents');
  const bucketWithHyphen = bucketsData?.find(b => b.name === 'verification-documents');
  
  console.log('Bucket with underscore exists:', !!bucketWithUnderscore);
  console.log('Bucket with hyphen exists:', !!bucketWithHyphen);
  
  // Return the correct bucket name
  return bucketWithUnderscore ? 'verification_documents' : 
         bucketWithHyphen ? 'verification-documents' : 'verification_documents';
};

/**
 * Checks if user is a freelancer
 */
export const isUserFreelancer = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if user is freelancer:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserFreelancer:', error);
    return false;
  }
};
