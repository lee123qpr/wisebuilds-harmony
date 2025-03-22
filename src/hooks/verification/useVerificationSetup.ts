
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupVerification } from './setupVerification';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initVerification = async () => {
      try {
        setLoading(true);
        const result = await setupVerification();
        
        if (result.success) {
          console.log('Verification setup successful:', result.message);
          setSetupComplete(true);
        } else {
          console.error('Verification setup failed:', result.message);
          toast({
            variant: 'destructive',
            title: 'Setup Failed',
            description: 'Could not set up verification. Please try again later.',
          });
          setSetupComplete(false);
        }
      } catch (error) {
        console.error('Error in verification setup:', error);
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'An unexpected error occurred during setup.',
        });
        setSetupComplete(false);
      } finally {
        setLoading(false);
      }
    };

    initVerification();
  }, [toast]);

  return {
    setupComplete,
    loading
  };
};
