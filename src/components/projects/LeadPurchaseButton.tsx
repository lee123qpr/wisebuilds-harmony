
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ShieldCheck, Info } from 'lucide-react';
import { usePurchaseLead, useCheckPurchaseStatus } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { useVerification } from '@/hooks/useVerification';
import { useToast } from '@/hooks/use-toast';
import { calculateLeadCredits } from '@/hooks/leads/utils/calculateLeadCredits';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeadPurchaseButtonProps {
  projectId: string;
  projectTitle?: string;
  project?: any; // Full project details
  purchasesCount?: number;
  onPurchaseSuccess: () => void;
}

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

  // Calculate required credits based on project details
  useEffect(() => {
    if (project && project.budget && project.duration && project.hiring_status) {
      const credits = calculateLeadCredits(
        project.budget,
        project.duration,
        project.hiring_status
      );
      setRequiredCredits(credits);
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
        
        // Refetch credit balance
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

  // Determine if the purchase button should be disabled
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

  // Show verification tooltip if needed
  if (verificationStatus === 'pending' || verificationStatus === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              disabled={true}
              className="flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Requires Verification
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {verificationStatus === 'pending' 
              ? 'Your ID verification is pending. You cannot purchase leads until your ID is verified.' 
              : 'Your ID verification was rejected. Please submit a new document.'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
                : limitReached
                  ? 'Limit Reached'
                  : notEnoughCredits
                    ? 'Insufficient Credits'
                    : `Purchase Lead (${requiredCredits} ${requiredCredits === 1 ? 'Credit' : 'Credits'})`}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-semibold mb-1">Credit Cost Breakdown:</div>
            {project && (
              <div className="space-y-1">
                <div>Budget: {requiredCredits > 0 ? project.budget.replace(/_/g, ' ') : 'N/A'}</div>
                <div>Duration: {project?.duration?.replace(/_/g, ' ')}</div>
                <div>Hiring Status: {project?.hiring_status?.replace(/_/g, ' ')}</div>
                <div className="border-t pt-1 mt-1">Total: {requiredCredits} credits</div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeadPurchaseButton;
