
import React from 'react';
import { Badge } from '@/components/ui/badge';

type HiringStatusBadgeProps = {
  status: string;
};

const HiringStatusBadge = ({ status }: HiringStatusBadgeProps) => {
  return (
    <Badge 
      variant={
        status === 'urgent' 
          ? 'destructive' 
          : status === 'ready' 
            ? 'default' 
            : 'outline'
      }
    >
      {status === 'urgent' 
        ? 'Urgent' 
        : status === 'ready' 
          ? 'Ready to hire' 
          : 'Enquiring'}
    </Badge>
  );
};

export default HiringStatusBadge;
