
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

// Additional helper to create bucket policies using RPC instead of direct API calls
export const createBucketPolicies = async (bucketName: string): Promise<boolean> => {
  try {
    // Use RPC calls instead of direct policy creation
    // For upload policy
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can upload their own documents',
      operation: 'INSERT',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`
    });
    
    // For view policy
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can view their own documents',
      operation: 'SELECT',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`
    });
    
    // For delete policy
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: 'Users can delete their own documents',
      operation: 'DELETE',
      policy_definition: `(bucket_id = '${bucketName}' AND auth.uid()::text = SPLIT_PART(name, '/', 1))`
    });
    
    return true;
  } catch (error) {
    console.error('Error creating bucket policies:', error);
    return false;
  }
};
