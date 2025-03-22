
import { supabase } from '@/integrations/supabase/client';

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

// Modified to use SQL RPC functions instead of direct API methods
export const createBucketPolicies = async (bucketName: string): Promise<boolean> => {
  try {
    // Use RPC functions to create the storage policies
    // For upload policy
    const { error: uploadError } = await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can upload their own documents',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`,
      operation: 'INSERT'
    });
    
    if (uploadError) console.error('Error creating upload policy:', uploadError);
    
    // For view policy
    const { error: viewError } = await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can view their own documents',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`,
      operation: 'SELECT'
    });
    
    if (viewError) console.error('Error creating view policy:', viewError);
    
    // For delete policy
    const { error: deleteError } = await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can delete their own documents',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`,
      operation: 'DELETE'
    });
    
    if (deleteError) console.error('Error creating delete policy:', deleteError);
    
    return !(uploadError || viewError || deleteError);
  } catch (error) {
    console.error('Error creating bucket policies:', error);
    return false;
  }
};
