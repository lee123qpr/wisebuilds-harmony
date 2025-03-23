
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';

interface CompletionStatusIndicatorProps {
  isCompleted: boolean;
  userCompleted: boolean;
  otherPartyCompleted: boolean;
  otherPartyLabel: string;
}

const CompletionStatusIndicator: React.FC<CompletionStatusIndicatorProps> = ({
  isCompleted,
  userCompleted,
  otherPartyCompleted,
  otherPartyLabel
}) => {
  if (isCompleted) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4" />
        Completed
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
      <Clock className="h-4 w-4" />
      {userCompleted 
        ? `Waiting for ${otherPartyLabel}` 
        : `${otherPartyLabel} marked complete`}
    </Badge>
  );
};

export default CompletionStatusIndicator;
