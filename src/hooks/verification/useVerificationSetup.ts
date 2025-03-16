
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupVerification } from './setupVerification';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeVerification = async () => {
      try {
        setIsSettingUp(true);
        const result = await setupVerification();
        
        console.log('Verification system setup result:', result);
        
        if (result && result.success) {
          setSetupComplete(true);
        } else {
          console.error('Error setting up verification system:', result?.error || 'Unknown error');
          toast({
            variant: 'destructive',
            title: 'Setup Error',
            description: 'Failed to initialize verification system. Please try again.',
          });
        }
      } catch (error) {
        console.error('Error in verification setup:', error);
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'Failed to initialize verification system. Please try again.',
        });
      } finally {
        setIsSettingUp(false);
      }
    };

    initializeVerification();
  }, [toast]);

  return {
    setupComplete,
    isSettingUp
  };
};
