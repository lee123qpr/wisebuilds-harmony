
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { VerificationData } from '@/hooks/verification/types';

interface SubmittedDocumentInfoProps {
  verificationData: VerificationData;
  isDeleting: boolean;
}

const SubmittedDocumentInfo: React.FC<SubmittedDocumentInfoProps> = ({
  verificationData,
  isDeleting,
}) => {
  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Document submitted</p>
          <p className="text-xs text-gray-500">
            Submitted on: {new Date(verificationData.submitted_at || '').toLocaleDateString()}
          </p>
        </div>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isDeleting}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
      </div>
    </div>
  );
};

export default SubmittedDocumentInfo;
