
import { supabase } from '@/integrations/supabase/client';

interface SetupResult {
  success: boolean;
  message?: string;
  error?: any;
}

/**
 * Sets up the verification system by calling the edge function
 */
export const setupVerification = async (): Promise<SetupResult> => {
  try {
    // Call the edge function to set up the verification system
    const { data, error } = await supabase.functions.invoke('setup-verification');
    
    if (error) {
      console.error('Error invoking setup-verification function:', error);
      return {
        success: false,
        error
      };
    }
    
    return {
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Error setting up verification system:', error);
    return {
      success: false,
      error
    };
  }
};
