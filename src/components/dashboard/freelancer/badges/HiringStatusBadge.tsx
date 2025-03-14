
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface HiringStatusBadgeProps {
  status: string;
}

const HiringStatusBadge = ({ status }: HiringStatusBadgeProps) => {
  const getHiringStatusStyles = () => {
    switch (status) {
      case 'enquiring':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#C4B5FD]';
      case 'ready':
        return 'bg-[#EDE9FE] text-[#6D28D9] border-[#A78BFA]';
      case 'urgent':
        return 'bg-[#DDD6FE] text-[#5B21B6] border-[#8B5CF6]';
      default:
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#A78BFA]';
    }
  };

  // Format status for display
  const formattedStatus = () => {
    switch (status) {
      case 'enquiring': return 'Just Enquiring';
      case 'ready': return 'Ready to Hire';
      case 'urgent': return 'Urgent';
      default: 
        return status
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getHiringStatusStyles()}`}>
      <Users className="h-3.5 w-3.5" />
      {formattedStatus()}
    </Badge>
  );
};

export default HiringStatusBadge;
