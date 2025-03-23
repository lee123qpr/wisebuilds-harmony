
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DisputeButtonProps {
  onClick: () => void;
}

const DisputeButton: React.FC<DisputeButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
      onClick={onClick}
    >
      <AlertTriangle className="h-4 w-4" />
      Dispute
    </Button>
  );
};

export default DisputeButton;
