
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { toast } = useToast();

  const setupVerificationSystem = async () => {
    setIsSettingUp(true);
    try {
      // Call the setup-verification edge function
      const { data, error } = await supabase.functions.invoke('setup-verification');
      
      if (error) {
        console.error('Error setting up verification system:', error);
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'Failed to set up verification system. Please try again later.',
        });
        return false;
      }
      
      console.log('Verification system setup result:', data);
      
      if (data.success) {
        setSetupComplete(true);
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Setup Issue',
          description: data.message || 'There was a problem setting up the verification system.',
        });
        return false;
      }
    } catch (error) {
      console.error('Error in setupVerificationSystem:', error);
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: 'An unexpected error occurred during setup. Please try again.',
      });
      return false;
    } finally {
      setIsSettingUp(false);
    }
  };

  // Run setup on component mount
  useEffect(() => {
    setupVerificationSystem();
  }, []);
  
  return { 
    setupComplete, 
    isSettingUp,
    runSetup: setupVerificationSystem 
  };
};

export default useVerificationSetup;
