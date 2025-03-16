
import { useState, useEffect } from 'react';
import { setupVerification } from './setupVerification';

export const useVerificationSetup = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    const runSetup = async () => {
      setIsSettingUp(true);
      setSetupError(null);
      
      try {
        const result = await setupVerification();
        console.log('Verification system setup result:', result);
        
        if (!result.success) {
          setSetupError(result.message || 'Failed to set up verification system');
        } else {
          setSetupComplete(true);
        }
      } catch (error: any) {
        console.error('Error setting up verification system:', error);
        setSetupError(error.message || 'Unexpected error during verification setup');
      } finally {
        setIsSettingUp(false);
      }
    };

    runSetup();
  }, []);

  return { 
    setupComplete,
    isSettingUp,
    setupError
  };
};

export default useVerificationSetup;
