
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import { mapStatusToVerificationStatus } from '../utils/status-utils';

// Upload ID document
export const uploadVerificationDocument = async (userId: string, file: File): Promise<{
  success: boolean;
  filePath?: string;
  verificationData?: VerificationData;
  error?: any;
}> => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log('Attempting to upload file:', fileName);
    
    // Upload the file to the verification_documents bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('verification_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    
    // Get the file path
    const path = uploadData?.path;
    console.log('File uploaded successfully to:', path);
    
    // Create or update the verification record
    const verificationRecord = {
      user_id: userId,
      id_document_path: filePath,
      verification_status: 'pending',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      const { data: verificationData, error: insertError } = await supabase
        .from('freelancer_verification')
        .upsert(verificationRecord, {
          onConflict: 'user_id'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Create verification record error:', insertError);
        
        // If we get an error when inserting the record, try to delete the uploaded file
        // to avoid orphaned files in storage
        try {
          await supabase.storage
            .from('verification_documents')
            .remove([filePath]);
          console.log('Cleaned up uploaded file after insert error');
        } catch (cleanupError) {
          console.error('Failed to clean up file after insert error:', cleanupError);
        }
        
        throw insertError;
      }
      
      if (!verificationData) {
        throw new Error('No verification data returned');
      }
      
      // Map the returned data to our expected format
      const result: VerificationData = {
        id: verificationData.id,
        user_id: verificationData.user_id,
        verification_status: mapStatusToVerificationStatus(verificationData.verification_status),
        id_document_path: verificationData.id_document_path,
        submitted_at: verificationData.submitted_at,
        verified_at: verificationData.verified_at,
        admin_notes: verificationData.admin_notes
      };
      
      return {
        success: true,
        filePath: path,
        verificationData: result
      };
    } catch (dbError) {
      // Clean up the uploaded file if database operation fails
      try {
        await supabase.storage
          .from('verification_documents')
          .remove([filePath]);
        console.log('Cleaned up uploaded file after database error');
      } catch (cleanupError) {
        console.error('Failed to clean up file after database error:', cleanupError);
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error };
  }
};
