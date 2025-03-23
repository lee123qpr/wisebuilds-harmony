
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface CompleteProjectButtonProps {
  onClick: () => void;
  otherPartyCompleted: boolean;
  disabled?: boolean;
}

const CompleteProjectButton: React.FC<CompleteProjectButtonProps> = ({
  onClick,
  otherPartyCompleted,
  disabled = false,
}) => {
  // If the other party has completed but user hasn't, show a more prominent button
  const buttonVariant = otherPartyCompleted ? "default" : "outline";
  const buttonClass = otherPartyCompleted 
    ? "bg-green-600 hover:bg-green-700 gap-2" 
    : "gap-2";
  
  return (
    <Button 
      variant={buttonVariant} 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      <CheckCircle2 className="h-4 w-4" />
      {otherPartyCompleted 
        ? 'Confirm Completion' 
        : 'Mark as Complete'}
    </Button>
  );
};

export default CompleteProjectButton;
