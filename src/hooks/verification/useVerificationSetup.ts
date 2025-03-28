
import { useState, useEffect } from 'react';
import { setupVerification } from './services';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        setLoading(true);
        const result = await setupVerification();
        setSetupComplete(result.success);
        
        if (!result.success) {
          console.error('Failed to setup verification system:', result.message);
          setError(new Error(result.message));
        }
      } catch (error: any) {
        console.error('Error in verification setup:', error);
        setSetupComplete(false);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  return {
    setupComplete,
    error,
    loading
  };
};
