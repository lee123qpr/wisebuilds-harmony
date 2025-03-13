
import React from 'react';
import { Badge } from '@/components/ui/badge';

type HiringStatusBadgeProps = {
  status: string;
};

const HiringStatusBadge = ({ status }: HiringStatusBadgeProps) => {
  // Define the display text and variant based on status
  const getDisplayProps = (status: string) => {
    switch (status) {
      case 'urgent':
        return { text: 'Urgent Hiring', variant: 'destructive' as const };
      case 'ready':
        return { text: 'Ready to Hire', variant: 'default' as const };
      case 'enquiring':
        return { text: 'Enquiring', variant: 'outline' as const };
      case 'paused':
        return { text: 'Hiring Paused', variant: 'secondary' as const };
      default:
        return { 
          text: status.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '), 
          variant: 'outline' as const 
        };
    }
  };

  const { text, variant } = getDisplayProps(status);

  return (
    <Badge variant={variant}>
      {text}
    </Badge>
  );
};

export default HiringStatusBadge;
