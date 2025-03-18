
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import VerificationBadge from '@/components/common/VerificationBadge';

interface VerificationMessageProps {
  verificationStatus: string;
}

const VerificationMessage: React.FC<VerificationMessageProps> = ({ verificationStatus }) => {
  return (
    <div className="flex flex-col gap-2">
      <VerificationBadge 
        type="id" 
        status={verificationStatus as any} 
        showTooltip={true}
      />
      
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
    </div>
  );
};

export default VerificationMessage;
