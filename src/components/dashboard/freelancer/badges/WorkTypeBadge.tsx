import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Filter } from 'lucide-react';

interface WorkTypeBadgeProps {
  workType: string;
}

const WorkTypeBadge = ({ workType }: WorkTypeBadgeProps) => {
  if (workType === 'any') {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]">
        <Filter className="h-3.5 w-3.5" />
        Any Work Type
      </Badge>
    );
  }

  const getWorkTypeStyles = () => {
    switch (workType) {
      case 'onsite':
        return 'bg-[#FEF4EB] text-[#D95A00] border-[#FEC6A1]';
      case 'remote':
        return 'bg-[#FFEDD5] text-[#F97316] border-[#F97316]';
      case 'hybrid':
        return 'bg-[#FFF7ED] text-[#C2410C] border-[#FA8D58]';
      default:
        return 'bg-[#FFF7ED] text-[#F97316] border-[#F97316]';
    }
  };

  const formattedType = workType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getWorkTypeStyles()}`}>
      <Briefcase className="h-3.5 w-3.5" />
      {formattedType}
    </Badge>
  );
};

export default WorkTypeBadge;
