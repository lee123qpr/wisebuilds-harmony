
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDisputeActions } from './hooks/useDisputeActions';
import DisputeForm from './DisputeForm';

interface DisputeButtonProps {
  quoteId: string;
  projectId: string;
}

const DisputeButton: React.FC<DisputeButtonProps> = ({ quoteId, projectId }) => {
  const {
    isOpen,
    setIsOpen,
    isSubmitting,
    submissionDeadline,
    openDisputeForm,
    handleSubmitDispute
  } = useDisputeActions({ quoteId, projectId });
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
        onClick={openDisputeForm}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Dispute
      </Button>
      
      <DisputeForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmitDispute}
        isSubmitting={isSubmitting}
        quoteId={quoteId}
        projectId={projectId}
        deadlineDate={submissionDeadline}
      />
    </>
  );
};

export default DisputeButton;
