
import React from 'react';
import QuoteStatusBadge from '../table/QuoteStatusBadge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return <QuoteStatusBadge status={status} />;
};

export default StatusBadge;
