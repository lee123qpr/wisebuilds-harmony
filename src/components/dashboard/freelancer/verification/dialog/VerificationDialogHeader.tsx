
import React from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const VerificationDialogHeader: React.FC = () => {
  return (
    <DialogHeader>
      <DialogTitle>Identity Verification</DialogTitle>
      <DialogDescription>
        Upload a government-issued ID (passport, driver's license, or national ID card) to verify your identity.
        <span className="text-orange-500 font-medium block mt-1">
          Note: Must be a UK or Ireland issued document.
        </span>
      </DialogDescription>
    </DialogHeader>
  );
};

export default VerificationDialogHeader;
