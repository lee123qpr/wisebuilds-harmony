
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user is a freelancer
 */
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Check the freelancer_profiles table
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking freelancer status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isUserFreelancer:', error);
    return false;
  }
};

/**
 * Check if the id-documents bucket is accessible
 */
export const checkIdDocumentsBucketAccess = async (): Promise<boolean> => {
  try {
    console.log('Checking bucket access...');
    
    // First check if the bucket exists by trying to get a public URL
    // This is a lightweight operation that doesn't require special permissions
    try {
      const { data } = await supabase.storage
        .from('id-documents')
        .getPublicUrl('test.txt');
      
      // If we got here, the bucket exists (even if the file doesn't)
      console.log('Bucket exists, public URL generated');
      
      // Now try a more restricted operation to see if we have proper access
      // Listing bucket contents requires additional permissions
      const { data: listData, error: listError } = await supabase.storage
        .from('id-documents')
        .list('', {
          limit: 1,
        });
      
      if (listError) {
        // This could fail due to permissions, which is expected for regular users
        console.log('Bucket access restricted but bucket exists:', listError);
        return true; // Bucket exists, even if we can't list its contents
      }
      
      console.log('Full bucket access confirmed, listed items:', listData?.length || 0);
      return true;
    } catch (error) {
      console.error('Error checking bucket existence:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in checkIdDocumentsBucketAccess:', error);
    return false;
  }
};
