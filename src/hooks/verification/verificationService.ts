
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

// Fetch verification status
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
    // Query the freelancer_verification table
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      throw error;
    }
    
    console.log('Verification data retrieved:', data);
    
    // If no data found, return null
    if (!data) {
      return null;
    }
    
    // Map database status to frontend status type
    const status = mapDatabaseStatusToVerificationStatus(data.verification_status || data.status);
    
    // Return typed verification data
    return {
      id: data.id,
      user_id: data.user_id,
      document_path: data.id_document_path || data.document_path,
      document_name: data.document_name,
      document_type: data.document_type,
      document_size: data.document_size,
      status: status,
      admin_notes: data.admin_notes,
      submitted_at: data.submitted_at,
      reviewed_at: data.verified_at || data.reviewed_at
    };
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    throw error;
  }
};

// Upload ID document
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
    console.log('Starting document upload for user:', userId);
    
    // Create a unique file path - make sure the userId is the first part of the path
    // This is critical for RLS policies that check path ownership
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log('Generated file path:', filePath);
    
    // First check if the bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket('verification_documents');
    
    if (bucketError) {
      console.log('Bucket not found, setting up verification system first');
      // Call the setup function
      const setupResult = await setupVerification();
      
      if (!setupResult.success) {
        console.error('Failed to setup verification system:', setupResult.message);
        throw new Error('Failed to setup verification system: ' + setupResult.message);
      }
      
      console.log('Verification system setup complete');
    } else {
      console.log('Verification bucket exists');
    }
    
    // Try to upload the file
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
          id_document_path: filePath,
          document_path: filePath,
          document_name: file.name,
          document_size: file.size,
          document_type: file.type,
          verification_status: 'pending',
          status: 'pending',
          submitted_at: new Date().toISOString(),
          admin_notes: null,
          verified_at: null
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
          id_document_path: filePath,
          document_path: filePath,
          document_name: file.name,
          document_size: file.size,
          document_type: file.type,
          verification_status: 'pending',
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

// Delete ID document
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    console.log('Deleting document for user:', userId);
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('verification_documents')
      .remove([documentPath]);
    
    if (storageError) {
      console.error('Error deleting document from storage:', storageError);
      throw storageError;
    }
    
    // Delete or update the verification record
    const { error: dbError } = await supabase
      .from('freelancer_verification')
      .delete()
      .eq('user_id', userId);
    
    if (dbError) {
      console.error('Error deleting verification record:', dbError);
      throw dbError;
    }
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error deleting verification document:', error);
    return { success: false, error };
  }
};

// Setup verification system
export const setupVerification = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Call the edge function to set up the verification system
    const { data, error } = await supabase.functions.invoke('setup-verification');
    
    if (error) {
      console.error('Error calling setup-verification function:', error);
      return {
        success: false,
        message: `Failed to set up verification: ${error.message}`,
      };
    }
    
    return data || { success: true, message: 'Verification system set up successfully' };
  } catch (error: any) {
    console.error('Exception in setupVerification:', error);
    return {
      success: false,
      message: `Exception in setupVerification: ${error.message}`,
    };
  }
};

// Helper function to map database status to the frontend status type
const mapDatabaseStatusToVerificationStatus = (status: string | null): VerificationStatus => {
  if (!status) return 'not_submitted';
  
  switch (status.toLowerCase()) {
    case 'verified':
    case 'approved':
      return 'verified';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'rejected';
    default:
      return 'not_submitted';
  }
};
