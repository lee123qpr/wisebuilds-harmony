
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface VerificationStatusBadgeProps {
  status: string;
  className?: string;
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'approved':
      return <Badge className={`flex items-center gap-1 bg-green-500 ${className}`}>
        <CheckCircle className="h-3 w-3" />
        Approved
      </Badge>;
    case 'rejected':
      return <Badge className={`flex items-center gap-1 bg-red-500 ${className}`}>
        <AlertCircle className="h-3 w-3" />
        Rejected
      </Badge>;
    case 'pending':
    default:
      return <Badge className={`flex items-center gap-1 bg-amber-500 ${className}`}>
        <Clock className="h-3 w-3" />
        Pending
      </Badge>;
  }
};

export default VerificationStatusBadge;
