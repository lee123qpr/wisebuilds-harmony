
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
        return { text: 'Urgent', variant: 'destructive' as const };
      case 'ready':
        return { text: 'Ready to hire', variant: 'default' as const };
      case 'enquiring':
        return { text: 'Enquiring', variant: 'outline' as const };
      default:
        return { text: status.charAt(0).toUpperCase() + status.slice(1), variant: 'outline' as const };
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
