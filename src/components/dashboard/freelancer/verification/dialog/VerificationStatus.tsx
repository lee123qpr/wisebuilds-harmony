
import React from 'react';
import { VerificationStatus as VerificationStatusType } from '@/components/dashboard/freelancer/VerificationBadge';
import { VerificationData } from '@/hooks/verification/types';
import SubmittedDocumentInfo from '../SubmittedDocumentInfo';
import DocumentUploadSection from '../DocumentUploadSection';

interface VerificationStatusProps {
  verificationStatus: VerificationStatusType;
  verificationData: VerificationData | null;
  setupComplete: boolean;
  isUploading: boolean;
  isDeleting: boolean;
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onRemoveFile: () => void;
  onDelete: () => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  verificationStatus,
  verificationData,
  setupComplete,
  isUploading,
  isDeleting,
  selectedFile,
  onFileSelected,
  onRemoveFile,
  onDelete,
}) => {
  // Check if it's a new verification or rejected to allow resubmission
  const canSubmit = verificationStatus !== 'verified' && verificationStatus !== 'pending';
  // Document has been submitted but not approved yet, so can be deleted
  const canDelete = verificationStatus === 'pending' || verificationStatus === 'rejected';

  return (
    <div className="grid gap-4 py-4">
      <p className="text-sm text-muted-foreground">
        Your document will be reviewed by our team. This process usually takes 1-2 business days.
      </p>
      
      {canSubmit && (
        <DocumentUploadSection 
          setupComplete={setupComplete}
          isUploading={isUploading}
          onFileSelected={onFileSelected}
        />
      )}
      
      {canDelete && verificationData?.document_path && (
        <SubmittedDocumentInfo 
          verificationData={verificationData}
          isDeleting={isDeleting}
          onDelete={onDelete}
        />
      )}
      
      {selectedFile && (
        <div className="text-sm border border-gray-200 p-3 rounded-md bg-gray-50 flex justify-between items-center">
          <div className="truncate max-w-[250px]">
            Selected file: <span className="font-medium">{selectedFile.name}</span>
          </div>
          <button 
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={onRemoveFile}
            aria-label="Remove selected file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;
