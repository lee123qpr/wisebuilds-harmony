
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import VerificationDialogContent from './verification/VerificationDialogContent';
import { useVerification } from '@/hooks/verification';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const VerificationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { verificationStatus, isLoading } = useVerification();

  const getButtonLabel = () => {
    switch (verificationStatus) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Verification Pending';
      case 'rejected':
        return 'Re-submit Verification';
      default:
        return 'Verify Your Identity';
    }
  };

  const getTooltipContent = () => {
    switch (verificationStatus) {
      case 'approved':
        return 'Your identity has been verified. You now have full access to the platform.';
      case 'pending':
        return 'We are reviewing your submitted document. This usually takes 1-2 business days.';
      case 'rejected':
        return 'Your verification was declined. Please submit a new document.';
      default:
        return 'Upload a government ID to unlock all platform features and apply for jobs.';
    }
  };

  // Handle button click to open dialog
  const handleOpenDialog = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={verificationStatus === 'approved' ? 'ghost' : 'outline'} 
                className="flex items-center gap-2"
                disabled={verificationStatus === 'approved' || isLoading}
                onClick={handleOpenDialog}
              >
                <ShieldCheck className="h-4 w-4" />
                {isLoading ? 'Loading...' : getButtonLabel()}
                {verificationStatus !== 'approved' && 
                  <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{getTooltipContent()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      {open && <VerificationDialogContent onClose={() => setOpen(false)} />}
    </Dialog>
  );
};

export default VerificationDialog;
