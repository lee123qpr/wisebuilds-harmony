
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useVerificationSetup = () => {
  const { user } = useAuth();
  const [setupComplete, setSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setupVerificationSystem() {
      setIsLoading(true);
      try {
        // Check if the verification_documents bucket exists
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('verification_documents');
        
        if (bucketError || !bucketData) {
          console.log('Verification system not set up, initializing...');
          
          // Call the setup-verification Edge Function
          const { data, error } = await supabase.functions.invoke('setup-verification');
          
          if (error) {
            console.error('Error setting up verification system:', error);
            return;
          }
          
          console.log('Verification system setup result:', data);
          setSetupComplete(true);
        } else {
          console.log('Verification system already set up');
          setSetupComplete(true);
        }
      } catch (error) {
        console.error('Error in verification setup:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    setupVerificationSystem();
  }, [user]);

  return {
    setupComplete,
    isLoading
  };
};
