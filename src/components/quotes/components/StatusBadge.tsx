
import React from 'react';
import QuoteStatusBadge from '../table/QuoteStatusBadge';
import { Quote } from '@/types/quotes';

interface StatusBadgeProps {
  status: Quote['status']; // Use the Quote status type from our types
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return <QuoteStatusBadge status={status} />;
};

export default StatusBadge;
