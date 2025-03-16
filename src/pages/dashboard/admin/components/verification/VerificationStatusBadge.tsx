
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VerificationStatusBadgeProps {
  status: string;
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-500">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-amber-500">Pending</Badge>;
  }
};

export default VerificationStatusBadge;
