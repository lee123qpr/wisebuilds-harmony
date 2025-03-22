
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setupVerification } from './services';

export const useVerificationSetup = () => {
  const { user } = useAuth();
  const [setupComplete, setSetupComplete] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupError, setSetupError] = useState<Error | null>(null);

  useEffect(() => {
    const initSetup = async () => {
      if (!user) return;
      
      setIsSettingUp(true);
      try {
        console.log('Initializing verification setup');
        const result = await setupVerification();
        setSetupComplete(result.success);
        
        if (!result.success) {
          console.error('Setup failed:', result.message);
          setSetupError(new Error(result.message));
        }
      } catch (error: any) {
        console.error('Error in verification setup:', error);
        setSetupError(error);
        setSetupComplete(false);
      } finally {
        setIsSettingUp(false);
      }
    };
    
    initSetup();
  }, [user]);

  return {
    setupComplete,
    isSettingUp,
    setupError
  };
};
