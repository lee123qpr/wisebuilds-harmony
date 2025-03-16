
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up the verification system by calling a dedicated edge function
 * This includes creating storage buckets and setting up RLS policies
 */
export const setupVerificationSystem = async (): Promise<boolean> => {
  try {
    console.log('Setting up verification system...');
    
    // Call the setup-verification edge function
    const { data, error } = await supabase.functions.invoke('setup-verification');
    
    if (error) {
      console.error('Error setting up verification system:', error);
      return false;
    }
    
    console.log('Verification system setup successful:', data);
    return true;
  } catch (error) {
    console.error('Error setting up verification system:', error);
    return false;
  }
};
