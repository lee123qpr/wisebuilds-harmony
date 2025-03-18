
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

interface VerificationDialogFooterProps {
  verificationStatus: VerificationStatus;
  selectedFile: File | null;
  setupComplete: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const VerificationDialogFooter: React.FC<VerificationDialogFooterProps> = ({
  verificationStatus,
  selectedFile,
  setupComplete,
  isUploading,
  isDeleting,
  onCancel,
  onSubmit,
}) => {
  // Check if it's a new verification or rejected to allow resubmission
  const canSubmit = verificationStatus !== 'verified' && verificationStatus !== 'pending';

  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading || isDeleting}>
        Cancel
      </Button>
      {canSubmit && selectedFile && (
        <Button 
          onClick={onSubmit} 
          disabled={!selectedFile || isUploading || !setupComplete}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Submit for Verification'
          )}
        </Button>
      )}
    </DialogFooter>
  );
};

export default VerificationDialogFooter;
