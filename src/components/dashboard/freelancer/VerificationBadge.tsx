
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
      description: 'Your ID verification is being reviewed by our team. This process usually takes 1-2 business days.',
      classes: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    approved: {
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'Verified',
      description: 'Your identity has been verified. You now have full access to all platform features.',
      classes: 'bg-green-50 text-green-700 border-green-200'
    },
    rejected: {
      icon: <AlertCircle className="h-3 w-3" />,
      label: 'Verification Failed',
      description: 'Your ID verification was rejected. Please submit a new document that meets our requirements.',
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
            className={`flex items-center gap-1 group ${config.classes} ${className}`}
          >
            {config.icon}
            {config.label}
            <HelpCircle className="h-3 w-3 ml-1 opacity-70 group-hover:opacity-100" />
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
