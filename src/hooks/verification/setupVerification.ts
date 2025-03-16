
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const setupVerificationSystem = async (): Promise<boolean> => {
  try {
    console.log('Setting up verification system...');
    
    const { data, error } = await supabase.functions.invoke('setup-verification');
    
    if (error) {
      console.error('Error setting up verification system:', error);
      return false;
    }
    
    console.log('Verification system setup response:', data);
    return true;
  } catch (error) {
    console.error('Error invoking setup function:', error);
    return false;
  }
};

export const useSetupVerification = () => {
  const { toast } = useToast();
  
  const setup = async () => {
    toast({
      title: 'Setting up verification system...',
      description: 'Please wait...',
    });
    
    const success = await setupVerificationSystem();
    
    if (success) {
      toast({
        title: 'Setup complete',
        description: 'Verification system is ready to use.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Setup failed',
        description: 'Could not setup verification system. Please try again.',
      });
    }
    
    return success;
  };
  
  return { setup };
};
