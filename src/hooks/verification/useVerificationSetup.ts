
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupVerificationSystem } from './setupVerification';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const runSetup = async () => {
      const success = await setupVerificationSystem();
      setSetupComplete(success);
      if (!success) {
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'There was a problem setting up the verification system. Please try again later.',
        });
      }
    };
    
    runSetup();
  }, [toast]);

  return { setupComplete };
};
