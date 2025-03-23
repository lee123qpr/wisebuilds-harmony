
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Check } from 'lucide-react';

interface CompletionStatusBadgeProps {
  isFullyCompleted: boolean;
  isPartiallyCompleted: boolean;
}

const CompletionStatusBadge: React.FC<CompletionStatusBadgeProps> = ({ 
  isFullyCompleted,
  isPartiallyCompleted 
}) => {
  if (isFullyCompleted) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </Badge>
    );
  } 
  
  if (isPartiallyCompleted) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Awaiting Confirmation
      </Badge>
    );
  } 
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1">
      <Check className="h-3 w-3" />
      Active
    </Badge>
  );
};

export default CompletionStatusBadge;
