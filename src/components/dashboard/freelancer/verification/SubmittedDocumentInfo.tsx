
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, HelpCircle } from 'lucide-react';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { VerificationData } from '@/hooks/verification/types';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium">Document submitted</p>
            <p className="text-xs text-gray-500">
              Submitted on: {new Date(verificationData.submitted_at || '').toLocaleDateString()}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <HelpCircle className="h-3 w-3 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Your document is being reviewed by our team. This usually takes 1-2 business days.
                  You can delete this document and submit a new one if needed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
