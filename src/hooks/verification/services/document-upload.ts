
import { supabase } from '@/integrations/supabase/client';
import { fetchVerificationStatus } from './verification-status';
import { setupVerification } from './verification-setup';
import { getVerificationBucketName } from './storage-utils';
import type { VerificationData } from '../types';

/**
 * Uploads verification document for a user
 */
export const uploadVerificationDocument = async (
  file: File
): Promise<{ 
  success: boolean;
  filePath?: string;
  error?: any;
  verificationData?: VerificationData
}> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { 
        success: false, 
        error: new Error('Authentication required') 
      };
    }
    
    const userId = user.id;
    console.log('Starting document upload for user:', userId);
    
    // Create a unique file path - make sure the userId is the first part of the path
    // This is critical for RLS policies that check path ownership
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log('Generated file path:', filePath);
    
    // Determine which bucket name to use
    const bucketName = await getVerificationBucketName();
    console.log(`Using bucket name: ${bucketName}`);
    
    // If no bucket exists, set up the verification system
    if (bucketName === 'verification_documents' && !(await bucketExists(bucketName))) {
      console.log('Bucket not found, setting up verification system first');
      // Call the setup function
      const setupResult = await setupVerification();
      
      if (!setupResult.success) {
        console.error('Failed to setup verification system:', setupResult.message);
        throw new Error('Failed to setup verification system: ' + setupResult.message);
      }
      
      console.log('Verification system setup complete');
    }
    
    // Try to upload the file
    console.log(`Attempting to upload file to storage path: ${filePath} in bucket: ${bucketName}`);
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite existing files
      });
    
    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError);
      return { 
        success: false, 
        error: uploadError 
      };
    }
    
    console.log('File uploaded successfully, now updating verification record');
    
    // Check if the user already has a verification record
    const existingVerification = await fetchVerificationStatus();
    
    let updateError;
    
    if (existingVerification) {
      // If there's an existing verification record, update it
      console.log('Updating existing verification record for user:', userId);
      const { error } = await supabase
        .from('freelancer_verification')
        .update({
          document_path: filePath,
          document_name: file.name,
          document_size: file.size,
          document_type: file.type,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          admin_notes: null,
          reviewed_at: null
        })
        .eq('user_id', userId);
      
      updateError = error;
    } else {
      // If there's no existing verification record, create one
      console.log('Creating new verification record for user:', userId);
      const { error } = await supabase
        .from('freelancer_verification')
        .insert({
          user_id: userId,
          document_path: filePath,
          document_name: file.name,
          document_size: file.size,
          document_type: file.type,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });
      
      updateError = error;
    }
    
    if (updateError) {
      console.error('Error updating database record:', updateError);
      
      // Clean up the uploaded file if there was an error with the database record
      console.log('Cleaning up uploaded file due to database error');
      await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      return { 
        success: false, 
        error: updateError 
      };
    }
    
    // Get the updated verification data
    console.log('Fetching updated verification status');
    const updatedVerification = await fetchVerificationStatus();
    
    console.log('Document upload complete. Verification status:', updatedVerification?.status);
    
    return { 
      success: true, 
      filePath,
      verificationData: updatedVerification || undefined
    };
  } catch (error) {
    console.error('Error in uploadVerificationDocument:', error);
    return { 
      success: false, 
      error 
    };
  }
};

/**
 * Checks if a bucket exists
 */
async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return false;
    }
    
    return data.some(bucket => bucket.name === bucketName);
  } catch (error) {
    console.error('Error in bucketExists:', error);
    return false;
  }
}
