
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePurchaseLead } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';

interface LeadPurchaseButtonProps {
  projectId: string;
  onPurchaseSuccess: () => void;
}

const LeadPurchaseButton = ({ projectId, onPurchaseSuccess }: LeadPurchaseButtonProps) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const { purchaseLead, isPurchasing } = usePurchaseLead();
  const { user } = useAuth();
  const { creditBalance, isLoadingBalance } = useCredits();

  const handlePurchaseLead = async () => {
    const success = await purchaseLead(projectId);
    if (success) {
      setHasBeenPurchased(true);
      onPurchaseSuccess();
    }
  };

  const checkIfAlreadyPurchased = async () => {
    if (!user) return;
    
    const { data } = await supabase.rpc('check_application_exists', {
      p_project_id: projectId,
      p_user_id: user.id
    });
    
    if (data) {
      setHasBeenPurchased(true);
    }
  };

  // Check if the project has already been purchased when component mounts
  useEffect(() => {
    checkIfAlreadyPurchased();
  }, [projectId, user]);

  // Determine if the purchase button should be disabled
  const isPurchaseDisabled = 
    isPurchasing || 
    isLoadingBalance || 
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
      {isPurchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Purchase Lead (1 Credit)
    </Button>
  );
};

export default LeadPurchaseButton;
