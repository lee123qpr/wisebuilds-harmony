
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

// Fetch verification status
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching verification status:', error);
      throw error;
    }
    
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
    console.error('Error:', error);
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
    // Create a unique file path (WITHOUT user ID prefix in filename - it's already in the policy)
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
    
    // Create the verification record - use RPC instead of direct access to users table
    const { data: verificationData, error: insertError } = await supabase.rpc('create_verification_record', {
      p_user_id: userId,
      p_document_path: filePath
    });
    
    if (insertError) {
      console.error('Create verification record error:', insertError);
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
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error };
  }
};
