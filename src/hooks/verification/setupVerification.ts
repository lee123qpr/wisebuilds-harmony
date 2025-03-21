
import { supabase } from '@/integrations/supabase/client';

export const setupVerification = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Setting up verification system...');
    
    // Call the setup-verification edge function
    const { data, error } = await supabase.functions.invoke('setup-verification');
    
    if (error) {
      console.error('Error setting up verification system:', error);
      return {
        success: false,
        message: `Setup failed: ${error.message}`
      };
    }
    
    console.log('Verification system setup result:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error in setupVerification:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during setup'
    };
  }
};
