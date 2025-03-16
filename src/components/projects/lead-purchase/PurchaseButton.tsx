
import React from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CreditCostBreakdown from './CreditCostBreakdown';

interface PurchaseButtonProps {
  isCheckingPurchase: boolean;
  isPurchasing: boolean;
  isPurchaseDisabled: boolean;
  limitReached: boolean;
  notEnoughCredits: boolean;
  requiredCredits: number;
  project: any;
  onPurchase: () => void;
}

const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  isCheckingPurchase,
  isPurchasing,
  isPurchaseDisabled,
  limitReached,
  notEnoughCredits,
  requiredCredits,
  project,
  onPurchase
}) => {
  const buttonText = isCheckingPurchase 
    ? 'Checking...' 
    : isPurchasing 
      ? 'Purchasing...' 
      : limitReached
        ? 'Limit Reached'
        : notEnoughCredits
          ? 'Insufficient Credits'
          : `Purchase Lead (${requiredCredits} ${requiredCredits === 1 ? 'Credit' : 'Credits'})`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          onClick={onPurchase} 
          disabled={isPurchaseDisabled}
          className="flex items-center gap-2"
        >
          {isPurchasing || isCheckingPurchase ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {buttonText}
        </Button>
      </TooltipTrigger>
      <CreditCostBreakdown project={project} requiredCredits={requiredCredits} />
    </Tooltip>
  );
};

export default PurchaseButton;
