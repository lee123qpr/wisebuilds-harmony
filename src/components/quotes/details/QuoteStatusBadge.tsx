
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X } from 'lucide-react';
import { Quote } from '@/types/quotes';

interface QuoteStatusBadgeProps {
  status: Quote['status'];
}

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'accepted':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <X className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          No Quote Issued
        </Badge>
      );
  }
};

export default QuoteStatusBadge;
