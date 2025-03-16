
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData, VerificationStatus } from './types';

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
        verification_status: data.verification_status as 'pending' | 'approved' | 'rejected',
        id_document_path: data.id_document_path,
        submitted_at: data.submitted_at,
        verified_at: data.verified_at,
        admin_notes: data.admin_notes,
        created_at: data.created_at,
        updated_at: data.updated_at,
        verified_by: data.verified_by
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
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/id-document-${Date.now()}.${fileExt}`;
    
    // Upload the file to the id-documents bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    
    // Get the file path
    const filePath = uploadData?.path;
    console.log('File uploaded successfully to:', filePath);
    
    // Check if verification record exists
    const { data: existingData, error: checkError } = await supabase
      .from('freelancer_verification')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking verification record:', checkError);
      throw checkError;
    }
    
    let resultData;
    
    if (!existingData) {
      console.log('Creating new verification record...');
      // Create new verification record
      const { data, error } = await supabase
        .from('freelancer_verification')
        .insert({
          user_id: userId,
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Insert verification record error:', error);
        throw error;
      }
      
      resultData = data;
    } else {
      console.log('Updating existing verification record...');
      // Update existing verification record
      const { data, error } = await supabase
        .from('freelancer_verification')
        .update({
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Update verification record error:', error);
        throw error;
      }
      
      resultData = data;
    }
    
    if (resultData) {
      const verificationData: VerificationData = {
        id: resultData.id,
        user_id: resultData.user_id,
        verification_status: resultData.verification_status as 'pending' | 'approved' | 'rejected',
        id_document_path: resultData.id_document_path,
        submitted_at: resultData.submitted_at,
        verified_at: resultData.verified_at,
        admin_notes: resultData.admin_notes,
        created_at: resultData.created_at,
        updated_at: resultData.updated_at,
        verified_by: resultData.verified_by
      };
      
      return {
        success: true,
        filePath,
        verificationData
      };
    }
    
    return { success: false, error: 'No verification data returned' };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error };
  }
};
