
import { supabase } from '@/integrations/supabase/client';
import { isUserFreelancer } from './user-verification';
import { fetchVerificationStatus } from './verification-status';
import type { VerificationData } from '../types';

// Upload verification document
export const uploadVerificationDocument = async (userId: string, file: File): Promise<{
  success: boolean;
  filePath?: string;
  verificationData?: VerificationData;
  error?: any;
  errorMessage?: string;
}> => {
  try {
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.error('Only freelancers can upload verification documents');
      return { 
        success: false, 
        error: new Error('Only freelancers can upload verification documents'), 
        errorMessage: 'Permission denied. Please ensure you are registered as a freelancer.'
      };
    }
    
    console.log('Starting document upload process for user:', userId);
    
    // Generate a safe file name with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${timestamp}.${fileExt}`;
    const filePath = `${userId}/${safeFileName}`;
    
    console.log('Uploading file to:', filePath);
    
    // Check if we can access the bucket at all
    try {
      const { data: checkData, error: checkError } = await supabase.storage
        .from('id-documents')
        .list(userId, { limit: 1 });
        
      if (checkError && !checkError.message.includes('Object not found') && checkError.status !== 404) {
        console.error('Error checking bucket access:', checkError);
        return {
          success: false,
          error: checkError,
          errorMessage: 'Cannot access document storage. Please try again later.'
        };
      }
    } catch (checkErr) {
      console.warn('Error during bucket access check:', checkErr);
      // Continue anyway, the actual upload will tell us if there's a real problem
    }
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return {
        success: false,
        error: uploadError,
        errorMessage: 'Failed to upload document. Please try again.'
      };
    }
    
    console.log('File uploaded successfully:', uploadData.path);
    
    try {
      // Create new record directly without checking existing (simplifies flow)
      const { data: newRecord, error: insertError } = await supabase
        .from('freelancer_verification')
        .insert({
          user_id: userId,
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select('*')
        .single();
      
      if (insertError) {
        console.error('Error inserting verification record:', insertError);
        
        // Try to clean up the uploaded file if record creation fails
        try {
          await supabase.storage.from('id-documents').remove([filePath]);
          console.log('Cleaned up uploaded file after failed record creation');
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
        
        // Provide more detailed error message based on error type
        let errorMessage = 'Failed to create verification record. Please try again.';
        
        if (insertError.code === '42501') {
          errorMessage = 'Permission denied. Please ensure you are logged in as a freelancer.';
        } else if (insertError.code === '23505') {
          errorMessage = 'You already have a verification record. Please try deleting your existing document first.';
        }
        
        return {
          success: false,
          error: insertError,
          errorMessage
        };
      }
      
      console.log('New verification record created:', newRecord);
      
      return { 
        success: true, 
        filePath,
        verificationData: {
          id: newRecord.id,
          user_id: newRecord.user_id,
          verification_status: 'pending',
          id_document_path: newRecord.id_document_path,
          submitted_at: newRecord.submitted_at,
          verified_at: newRecord.verified_at,
          admin_notes: newRecord.admin_notes
        }
      };
    } catch (dbError) {
      // If database operation fails, clean up the uploaded file
      try {
        await supabase.storage.from('id-documents').remove([filePath]);
        console.log('Cleaned up uploaded file after database error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error in uploadVerificationDocument:', error);
    return { 
      success: false, 
      error,
      errorMessage: 'An unexpected error occurred. Please try again later.'
    };
  }
};
