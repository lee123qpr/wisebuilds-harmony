
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

// Converts database string status to our VerificationStatus type
export const mapStatusToVerificationStatus = (status: string): VerificationStatus => {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status;
  }
  return 'not_submitted';
};

// Check if current user is a freelancer
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    return user.user_metadata?.user_type === 'freelancer';
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};

// Fetch verification status
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.log('User is not a freelancer, verification not applicable');
      return null;
    }
    
    // Query the freelancer_verification table directly
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If record not found, don't treat as an error
      if (error.code === 'PGRST116') {
        console.log('No verification record found for user');
        return null;
      }
      
      console.error('Error fetching verification status:', error);
      return null;
    }
    
    console.log('Verification data found:', data);
    
    if (data) {
      return {
        id: data.id,
        user_id: data.user_id,
        verification_status: mapStatusToVerificationStatus(data.verification_status),
        id_document_path: data.id_document_path,
        submitted_at: data.submitted_at,
        verified_at: data.verified_at,
        admin_notes: data.admin_notes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    return null;
  }
};

// Upload ID document
export const uploadVerificationDocument = async (userId: string, file: File): Promise<{
  success: boolean;
  filePath?: string;
  verificationData?: VerificationData;
  error?: any;
}> => {
  try {
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.error('Only freelancers can upload verification documents');
      return { 
        success: false, 
        error: new Error('Only freelancers can upload verification documents') 
      };
    }
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log('Attempting to upload file:', fileName);
    
    // Upload the file to the id-documents bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-documents')
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
    
    // Create or update the verification record without trying to join with users table
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
            .from('id-documents')
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
          .from('id-documents')
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

// Delete verification document and reset status
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.error('Only freelancers can manage verification documents');
      return { 
        success: false, 
        error: new Error('Only freelancers can manage verification documents') 
      };
    }
    
    console.log('Attempting to delete document:', documentPath);
    
    // Delete the file from storage
    const { error: deleteFileError } = await supabase.storage
      .from('id-documents')
      .remove([documentPath]);
    
    if (deleteFileError) {
      console.error('Error deleting file:', deleteFileError);
      throw deleteFileError;
    }
    
    console.log('File deleted successfully');
    
    // Update the verification record to reset status
    const { error: updateError } = await supabase
      .from('freelancer_verification')
      .update({
        id_document_path: null,
        verification_status: 'not_submitted',
        submitted_at: null,
        verified_at: null,
        admin_notes: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating verification record:', updateError);
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error };
  }
};
