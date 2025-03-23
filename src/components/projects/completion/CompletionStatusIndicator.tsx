
import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  otherPartyLabel,
}) => {
  if (isCompleted) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <CheckCircle2 className="h-4 w-4" />
        Project Completed
      </Badge>
    );
  }
  
  if (userCompleted) {
    return (
      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          {otherPartyCompleted 
            ? 'Project completion in progress' 
            : `Waiting for ${otherPartyLabel} to confirm completion`}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default CompletionStatusIndicator;
