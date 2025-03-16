
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, className }) => {
  if (status === 'not_submitted') {
    return null;
  }
  
  const statusConfig = {
    pending: {
      icon: <Clock className="h-3 w-3" />,
      label: 'Verification Pending',
      description: 'Your ID verification is being reviewed by our team',
      classes: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    approved: {
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'Verified',
      description: 'Your identity has been verified',
      classes: 'bg-green-50 text-green-700 border-green-200'
    },
    rejected: {
      icon: <AlertCircle className="h-3 w-3" />,
      label: 'Verification Failed',
      description: 'Your ID verification was rejected. Please submit a new document.',
      classes: 'bg-red-50 text-red-700 border-red-200'
    }
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${config.classes} ${className}`}
          >
            {config.icon}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
