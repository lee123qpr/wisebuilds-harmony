
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
        errorMessage: 'Permission denied. Please ensure you are logged in as a freelancer.'
      };
    }
    
    console.log('Starting document upload process for user:', userId);
    
    // Generate a safe file name with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const safeFileName = `${timestamp}.${fileExt}`;
    const filePath = `${userId}/${safeFileName}`;
    
    console.log('Uploading file to:', filePath);
    
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
    
    // Check if a verification record already exists
    const existingVerification = await fetchVerificationStatus(userId);
    
    if (existingVerification) {
      // If there's an existing document, remove it first
      if (existingVerification.id_document_path) {
        try {
          console.log('Removing previous document:', existingVerification.id_document_path);
          
          await supabase.storage
            .from('id-documents')
            .remove([existingVerification.id_document_path]);
            
          console.log('Previous document removed successfully');
        } catch (deleteError) {
          console.error('Error removing previous document:', deleteError);
          // Continue with the process even if deletion fails
        }
      }
      
      // Update existing record
      const { data: updatedRecord, error: updateError } = await supabase
        .from('freelancer_verification')
        .update({
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString(),
          verified_at: null,
          admin_notes: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingVerification.id)
        .select('*')
        .single();
      
      if (updateError) {
        console.error('Error updating verification record:', updateError);
        
        // Try to clean up the uploaded file if record update fails
        try {
          await supabase.storage.from('id-documents').remove([filePath]);
          console.log('Cleaned up uploaded file after failed record update');
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
        
        return {
          success: false,
          error: updateError,
          errorMessage: 'Failed to update verification record. Please try again.'
        };
      }
      
      console.log('Verification record updated:', updatedRecord);
      
      return { 
        success: true, 
        filePath,
        verificationData: {
          id: updatedRecord.id,
          user_id: updatedRecord.user_id,
          verification_status: 'pending',
          id_document_path: updatedRecord.id_document_path,
          submitted_at: updatedRecord.submitted_at,
          verified_at: updatedRecord.verified_at,
          admin_notes: updatedRecord.admin_notes
        }
      };
    } else {
      // Create new record
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
        
        return {
          success: false,
          error: insertError,
          errorMessage: 'Failed to create verification record. Please try again.'
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
