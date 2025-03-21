
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setupVerification } from './setupVerification';
import { useToast } from '@/hooks/use-toast';

export const useVerificationSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [setupComplete, setSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initVerificationSystem() {
      if (!user) return;
      
      setIsLoading(true);
      try {
        console.log('Initializing verification system...');
        const result = await setupVerification();
        
        if (result.success) {
          console.log('Verification system initialized successfully');
          setSetupComplete(true);
        } else {
          console.error('Failed to initialize verification system:', result.message);
          toast({
            variant: 'destructive',
            title: 'Setup Error',
            description: 'There was a problem setting up the verification system. Please try again later.',
          });
          setSetupComplete(false);
        }
      } catch (error) {
        console.error('Error in verification setup:', error);
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'There was a problem setting up the verification system. Please try again later.',
        });
        setSetupComplete(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    initVerificationSystem();
  }, [user, toast]);

  return {
    setupComplete,
    isLoading
  };
};
