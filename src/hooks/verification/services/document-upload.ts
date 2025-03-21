
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
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('verification_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return { 
        success: false, 
        error: uploadError 
      };
    }
    
    // Check if the user already has a verification record
    const existingVerification = await fetchVerificationStatus(userId);
    
    if (existingVerification) {
      // If there's an existing verification record, update it
      const { error: updateError } = await supabase
        .from('freelancer_verification')
        .update({
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString(),
          admin_notes: null,
          verified_at: null
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating verification record:', updateError);
        
        // Clean up the uploaded file if there was an error
        await supabase.storage
          .from('verification_documents')
          .remove([filePath]);
        
        return { 
          success: false, 
          error: updateError 
        };
      }
    } else {
      // If there's no existing verification record, create one
      const { error: insertError } = await supabase
        .from('freelancer_verification')
        .insert({
          user_id: userId,
          id_document_path: filePath,
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error creating verification record:', insertError);
        
        // Clean up the uploaded file if there was an error
        await supabase.storage
          .from('verification_documents')
          .remove([filePath]);
        
        return { 
          success: false, 
          error: insertError 
        };
      }
    }
    
    // Get the updated verification data
    const updatedVerification = await fetchVerificationStatus(userId);
    
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
