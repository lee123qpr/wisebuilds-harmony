
import { supabase } from '@/integrations/supabase/client';
import { fetchVerificationStatus } from './verification-status';
import type { VerificationData } from '../types';

export const uploadVerificationDocument = async (
  userId: string,
  file: File
): Promise<{ 
  success: boolean;
  filePath?: string;
  error?: any;
  verificationData?: VerificationData
}> => {
  try {
    console.log('Uploading verification document for user:', userId);
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // First, try to upload the file
    console.log('Attempting to upload file to storage path:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('verification_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
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
    const existingVerification = await fetchVerificationStatus(userId);
    
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
        .from('verification_documents')
        .remove([filePath]);
      
      return { 
        success: false, 
        error: updateError 
      };
    }
    
    // Get the updated verification data
    console.log('Fetching updated verification status');
    const updatedVerification = await fetchVerificationStatus(userId);
    
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
