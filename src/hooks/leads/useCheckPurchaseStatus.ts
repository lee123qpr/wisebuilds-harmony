
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCheckPurchaseStatus = (projectId: string | null, projectTitle?: string) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkIfAlreadyPurchased = async () => {
    if (!user || !projectId) {
      setIsCheckingPurchase(false);
      return;
    }
    
    try {
      console.log(`Checking if project already purchased: ${projectTitle || projectId}`);
      const { data, error } = await supabase.rpc('check_application_exists', {
        p_project_id: projectId,
        p_user_id: user.id
      });
      
      if (error) {
        console.error('Error checking application exists:', error);
        toast({
          title: 'Error',
          description: 'Could not check if you already purchased this lead',
          variant: 'destructive',
        });
      }
      
      console.log(`Application check result for ${projectTitle || projectId}:`, data);
      setHasBeenPurchased(data === true);
    } catch (err) {
      console.error(`Error checking application for ${projectTitle || projectId}:`, err);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  // Check if the project has already been purchased when component mounts or projectId/user changes
  useEffect(() => {
    if (projectId) {
      checkIfAlreadyPurchased();
    } else {
      setIsCheckingPurchase(false);
    }
  }, [projectId, user]);

  return {
    hasBeenPurchased,
    isCheckingPurchase,
    checkIfAlreadyPurchased
  };
};
