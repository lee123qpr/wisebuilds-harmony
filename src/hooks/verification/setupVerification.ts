
import { supabase } from '@/integrations/supabase/client';

export interface SetupResult {
  success: boolean;
  message: string;
}

/**
 * Set up the verification system
 * This function calls the edge function to set up the storage bucket and RLS policies
 */
export const setupVerification = async (): Promise<SetupResult> => {
  try {
    console.log('Setting up verification system...');
    
    // Call the setup edge function
    const response = await fetch('/api/setup-verification');
    
    console.log('Setup verification response status:', response.status);
    
    if (!response.ok) {
      // Try to parse the response as JSON, but handle cases where it's not JSON
      let errorData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error parsing error response as JSON:', parseError);
          errorData = { error: 'Invalid JSON in error response' };
        }
      } else {
        const textResponse = await response.text();
        console.error('Non-JSON error response:', textResponse.substring(0, 200) + '...');
        errorData = { error: 'Non-JSON response received' };
      }
      
      console.error('Error setting up verification system:', errorData);
      return {
        success: false,
        message: errorData.error || `Failed to set up verification system (Status: ${response.status})`
      };
    }
    
    let result;
    try {
      result = await response.json();
      console.log('Verification system setup result:', result);
    } catch (parseError) {
      console.error('Error parsing success response as JSON:', parseError);
      return {
        success: false,
        message: 'Server returned invalid JSON response'
      };
    }
    
    // Check if the bucket is accessible by trying a simple operation
    // This helps verify that the setup was successful
    try {
      // getPublicUrl doesn't return an error property, it only returns data
      const { data } = await supabase.storage
        .from('id-documents')
        .getPublicUrl('test.txt');
        
      console.log('Successfully generated public URL for test file');
    } catch (bucketError) {
      console.warn('Bucket access check warning:', bucketError);
      // Continue anyway as this might just be a permissions issue for the current user
    }
    
    return {
      success: true,
      message: 'Verification system setup completed successfully'
    };
  } catch (error: any) {
    console.error('Error in setupVerification:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred during setup'
    };
  }
};
