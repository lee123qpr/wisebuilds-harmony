
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ShieldCheck, Info } from 'lucide-react';
import { usePurchaseLead, useCheckPurchaseStatus } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { useVerification } from '@/hooks/useVerification';
import { useToast } from '@/hooks/use-toast';
import { calculateLeadCredits, budgetCredits, durationCredits, hiringStatusCredits } from '@/hooks/leads/utils/calculateLeadCredits';
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

  // Format project value for display
  const formatProjectValue = (value: string) => {
    if (!value) return 'N/A';
    return value.replace(/_/g, ' ');
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

  // Collect credits for each attribute if we have a project
  const budgetCredit = project?.budget ? budgetCredits[project.budget as keyof typeof budgetCredits] || 0 : 0;
  const durationCredit = project?.duration ? durationCredits[project.duration as keyof typeof durationCredits] || 0 : 0;
  const hiringStatusCredit = project?.hiring_status ? hiringStatusCredits[project.hiring_status as keyof typeof hiringStatusCredits] || 0 : 0;
  const baseCredit = 1;

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
        <TooltipContent className="p-3 w-64">
          <div className="text-sm">
            <div className="font-semibold mb-2">Credit Cost Breakdown:</div>
            {project ? (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Budget ({formatProjectValue(project.budget)}):</span>
                  <span className="font-medium">{budgetCredit} credit{budgetCredit !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration ({formatProjectValue(project.duration)}):</span>
                  <span className="font-medium">{durationCredit} credit{durationCredit !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hiring Status ({formatProjectValue(project.hiring_status)}):</span>
                  <span className="font-medium">{hiringStatusCredit} credit{hiringStatusCredit !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Credit:</span>
                  <span className="font-medium">{baseCredit} credit</span>
                </div>
                <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 font-bold">
                  <span>Total:</span>
                  <span>{requiredCredits} credit{requiredCredits !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Project details not available</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LeadPurchaseButton;
