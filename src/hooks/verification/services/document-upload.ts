
import { supabase } from '@/integrations/supabase/client';
import { getVerificationBucketName, generateVerificationFilePath } from './storage-utils';
import { fetchVerificationStatus } from './verification-status';

/**
 * Upload a verification document and create or update verification record
 */
export const uploadVerificationDocument = async (userId: string, file: File): Promise<{
  success: boolean;
  filePath?: string;
  verificationData?: any;
  error?: any;
}> => {
  try {
    // Get session and verify authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('Authentication required for file uploads');
    }
    
    // Verify user is uploading their own document
    if (session.session.user.id !== userId) {
      throw new Error('You can only upload verification documents for your own account');
    }
    
    console.log('Starting document upload for user:', userId);
    
    // Determine which bucket to use
    const bucketName = await getVerificationBucketName();
    console.log(`Using bucket name: ${bucketName}`);
    
    // Generate file path
    const filePath = generateVerificationFilePath(userId, file.name);
    console.log(`Uploading to path: ${filePath}`);
    
    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: false,
        cacheControl: '3600'
      });
    
    if (uploadError) {
      console.error('Error uploading document:', uploadError);
      throw uploadError;
    }
    
    console.log('Document uploaded successfully, data:', data);
    
    // Check if there's an existing verification record
    const existingVerification = await fetchVerificationStatus(userId);
    
    // Document metadata
    const documentName = file.name;
    const documentType = file.type;
    const documentSize = file.size;
    
    let dbResult;
    
    if (existingVerification) {
      // Update existing record
      console.log('Updating existing verification record');
      const { data: updateData, error: updateError } = await supabase
        .from('freelancer_verification')
        .update({
          document_path: filePath,
          document_name: documentName,
          document_type: documentType,
          document_size: documentSize,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select('*')
        .single();
      
      if (updateError) {
        console.error('Error updating verification record:', updateError);
        throw updateError;
      }
      
      dbResult = updateData;
    } else {
      // Create new record
      console.log('Creating new verification record');
      const { data: insertData, error: insertError } = await supabase
        .from('freelancer_verification')
        .insert({
          user_id: userId,
          document_path: filePath,
          document_name: documentName,
          document_type: documentType,
          document_size: documentSize,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .select('*')
        .single();
      
      if (insertError) {
        console.error('Error creating verification record:', insertError);
        throw insertError;
      }
      
      dbResult = insertData;
    }
    
    console.log('Verification record saved successfully:', dbResult);
    
    // Map database status to our verification status type
    return {
      success: true,
      filePath,
      verificationData: dbResult
    };
  } catch (error) {
    console.error('Error in uploadVerificationDocument:', error);
    return { success: false, error };
  }
};
