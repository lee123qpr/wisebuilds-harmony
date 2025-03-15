
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { usePurchaseLead } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadPurchaseButtonProps {
  projectId: string;
  onPurchaseSuccess: () => void;
}

const LeadPurchaseButton = ({ projectId, onPurchaseSuccess }: LeadPurchaseButtonProps) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const { purchaseLead, isPurchasing } = usePurchaseLead();
  const { user } = useAuth();
  const { creditBalance, isLoadingBalance, refetchCredits } = useCredits();
  const { toast } = useToast();

  const handlePurchaseLead = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase leads',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Attempting to purchase lead for project:', projectId);
    
    try {
      const success = await purchaseLead(projectId);
      
      console.log('Purchase lead result:', success);
      
      if (success) {
        console.log('Lead purchase successful');
        setHasBeenPurchased(true);
        onPurchaseSuccess();
        
        // Refetch credit balance
        if (refetchCredits) {
          await refetchCredits();
        }
      } else {
        console.log('Lead purchase failed');
      }
    } catch (error) {
      console.error('Error in handlePurchaseLead:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase lead. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const checkIfAlreadyPurchased = async () => {
    if (!user || !projectId) {
      setIsCheckingPurchase(false);
      return;
    }
    
    try {
      console.log('Checking if project already purchased:', projectId);
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
      
      console.log('Application check result:', data);
      setHasBeenPurchased(data === true);
    } catch (err) {
      console.error('Error in check_application_exists:', err);
    } finally {
      setIsCheckingPurchase(false);
    }
  };

  // Check if the project has already been purchased when component mounts or projectId/user changes
  useEffect(() => {
    checkIfAlreadyPurchased();
  }, [projectId, user]);

  // Determine if the purchase button should be disabled
  const isPurchaseDisabled = 
    isPurchasing || 
    isLoadingBalance || 
    isCheckingPurchase || 
    (typeof creditBalance === 'number' && creditBalance < 1);

  if (hasBeenPurchased) {
    return null;
  }

  return (
    <Button 
      onClick={handlePurchaseLead} 
      disabled={isPurchaseDisabled}
      className="flex items-center gap-2"
    >
      {isPurchasing || isCheckingPurchase ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {isCheckingPurchase 
        ? 'Checking...' 
        : isPurchasing 
          ? 'Purchasing...' 
          : `Purchase Lead (1 Credit)`}
    </Button>
  );
};

export default LeadPurchaseButton;
