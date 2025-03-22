import { useState, useEffect } from 'react';
import { setupVerification } from './services';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initSetup = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing verification system setup...');
        
        const result = await setupVerification();
        
        setSetupComplete(result.success);
        console.log('Verification system setup complete:', result);
        
        if (!result.success) {
          setError(new Error(result.message));
        }
      } catch (error: any) {
        console.error('Error during verification setup:', error);
        setError(error);
        setSetupComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    initSetup();
  }, []);

  return {
    setupComplete,
    isLoading,
    error
  };
};
