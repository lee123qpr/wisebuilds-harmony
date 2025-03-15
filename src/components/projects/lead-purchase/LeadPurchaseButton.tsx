
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePurchaseLead, useCheckPurchaseStatus } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { useVerification } from '@/hooks/verification';
import { useToast } from '@/hooks/use-toast';
import { calculateLeadCredits } from '@/hooks/leads/utils/calculateLeadCredits';
import { LeadPurchaseButtonProps } from './types';
import PurchaseButton from './PurchaseButton';
import VerificationMessage from './VerificationMessage';

const LeadPurchaseButton = ({ 
  projectId, 
  projectTitle, 
  project,
  purchasesCount = 0,
  onPurchaseSuccess 
}: LeadPurchaseButtonProps) => {
  const { purchaseLead, isPurchasing } = usePurchaseLead();
  const { hasBeenPurchased, isCheckingPurchase } = useCheckPurchaseStatus(projectId, projectTitle);
  const { user } = useAuth();
  const { creditBalance, isLoadingBalance, refetchCredits } = useCredits();
  const { isVerified, verificationStatus } = useVerification();
  const { toast } = useToast();
  const [requiredCredits, setRequiredCredits] = useState(1);
  
  const purchaseLimit = 5;
  const limitReached = purchasesCount >= purchaseLimit;
  const notEnoughCredits = typeof creditBalance === 'number' && creditBalance < requiredCredits;

  useEffect(() => {
    if (project && project.budget && project.duration && project.hiring_status) {
      console.log('Project details for credit calculation:', {
        budget: project.budget,
        duration: project.duration,
        hiring_status: project.hiring_status
      });
      
      const credits = calculateLeadCredits(
        project.budget,
        project.duration,
        project.hiring_status
      );
      setRequiredCredits(credits);
      console.log(`Required credits calculated: ${credits}`);
    } else {
      console.log('Missing project details for credit calculation:', project);
      setRequiredCredits(1); // Default fallback
    }
  }, [project]);

  const handlePurchaseLead = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase leads',
        variant: 'destructive',
      });
      return;
    }
    
    if (verificationStatus !== 'approved' && verificationStatus !== 'not_submitted') {
      toast({
        title: 'Verification required',
        description: 'Your ID verification is pending. You cannot purchase leads until your ID is verified.',
        variant: 'destructive',
      });
      return;
    }
    
    if (limitReached) {
      toast({
        title: 'Purchase limit reached',
        description: 'This lead has reached its maximum number of purchases',
        variant: 'destructive',
      });
      return;
    }
    
    console.log(`Attempting to purchase lead for project: ${projectTitle || projectId}`);
    
    try {
      const success = await purchaseLead(projectId, projectTitle, undefined, project);
      
      console.log(`Purchase result for ${projectTitle || projectId}:`, success);
      
      if (success) {
        console.log(`Lead purchase successful for ${projectTitle || projectId}`);
        onPurchaseSuccess();
        
        if (refetchCredits) {
          await refetchCredits();
        }
      } else {
        console.log(`Lead purchase failed for ${projectTitle || projectId}`);
      }
    } catch (error) {
      console.error(`Error purchasing lead for ${projectTitle || projectId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to purchase lead. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isPurchaseDisabled = 
    isPurchasing || 
    isLoadingBalance || 
    isCheckingPurchase || 
    limitReached ||
    notEnoughCredits ||
    (verificationStatus !== 'approved' && verificationStatus !== 'not_submitted');

  if (hasBeenPurchased) {
    return null;
  }

  if (verificationStatus === 'pending' || verificationStatus === 'rejected') {
    return <VerificationMessage verificationStatus={verificationStatus} />;
  }

  return (
    <TooltipProvider>
      <PurchaseButton
        isCheckingPurchase={isCheckingPurchase}
        isPurchasing={isPurchasing}
        isPurchaseDisabled={isPurchaseDisabled}
        limitReached={limitReached}
        notEnoughCredits={notEnoughCredits}
        requiredCredits={requiredCredits}
        project={project}
        onPurchase={handlePurchaseLead}
      />
    </TooltipProvider>
  );
};

export default LeadPurchaseButton;
