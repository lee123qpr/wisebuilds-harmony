
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import VerificationDialogContent from './verification/VerificationDialogContent';
import { useVerification } from '@/hooks/verification';

const VerificationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { verificationStatus } = useVerification();

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={verificationStatus === 'approved' ? 'ghost' : 'outline'} 
          className="flex items-center gap-2"
          disabled={verificationStatus === 'approved'}
        >
          <ShieldCheck className="h-4 w-4" />
          {getButtonLabel()}
        </Button>
      </DialogTrigger>
      {open && <VerificationDialogContent onClose={() => setOpen(false)} />}
    </Dialog>
  );
};

export default VerificationDialog;
