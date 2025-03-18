
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export type VerificationType = 'email' | 'id' | 'none';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';

interface VerificationBadgeProps {
  type: VerificationType;
  status: VerificationStatus;
  className?: string;
  showTooltip?: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  type, 
  status, 
  className = '',
  showTooltip = true
}) => {
  // Configuration for different badge types and statuses
  const badgeConfig = {
    email: {
      verified: {
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Email Verified',
        description: 'Your email address has been verified',
        classes: 'bg-green-50 text-green-700 border-green-200'
      },
      pending: {
        icon: <HelpCircle className="h-3 w-3" />,
        label: 'Email Verification Pending',
        description: 'Please check your email and click the verification link',
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      }
    },
    id: {
      verified: {
        icon: <ShieldCheck className="h-3 w-3" />,
        label: 'ID Verified',
        description: 'Your identity has been verified',
        classes: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      pending: {
        icon: <HelpCircle className="h-3 w-3" />,
        label: 'Verification Pending',
        description: 'Your ID verification is being reviewed',
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      },
      rejected: {
        icon: <ShieldAlert className="h-3 w-3" />,
        label: 'Verification Failed',
        description: 'Your ID verification was rejected',
        classes: 'bg-red-50 text-red-700 border-red-200'
      }
    },
    none: {
      verified: {
        icon: <ShieldCheck className="h-3 w-3" />,
        label: 'Verified',
        description: 'This account has been verified',
        classes: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      pending: {
        icon: <HelpCircle className="h-3 w-3" />,
        label: 'Verification Pending',
        description: 'Verification is in progress',
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      },
      rejected: {
        icon: <ShieldAlert className="h-3 w-3" />,
        label: 'Not Verified',
        description: 'This account is not verified',
        classes: 'bg-red-50 text-red-700 border-red-200'
      },
      not_submitted: {
        icon: <ShieldAlert className="h-3 w-3" />,
        label: 'Not Verified',
        description: 'No verification has been submitted',
        classes: 'bg-gray-50 text-gray-700 border-gray-200'
      }
    }
  };

  // Get the appropriate config based on type and status
  const config = (
    type === 'id' ? badgeConfig.id[status] :
    type === 'email' ? badgeConfig.email[status] :
    badgeConfig.none[status]
  ) || badgeConfig.none.not_submitted;

  // Skip rendering if status is not_submitted for email type
  if (type === 'email' && status === 'not_submitted') {
    return null;
  }

  const badgeContent = (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${config.classes} ${className} ${showTooltip ? 'group' : ''}`}
    >
      {config.icon}
      {config.label}
      {showTooltip && <HelpCircle className="h-3 w-3 ml-1 opacity-70 group-hover:opacity-100" />}
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
