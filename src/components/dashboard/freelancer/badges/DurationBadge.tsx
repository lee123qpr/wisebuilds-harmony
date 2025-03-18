
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Filter } from 'lucide-react';

interface DurationBadgeProps {
  duration?: string;
}

const DurationBadge = ({ duration }: DurationBadgeProps) => {
  if (!duration) {
    return <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-gray-100 text-gray-600">
      <Clock className="h-3.5 w-3.5" />
      Unknown
    </Badge>;
  }
  
  if (duration === 'any') {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]">
        <Filter className="h-3.5 w-3.5" />
        Any Duration
      </Badge>
    );
  }

  const getDurationStyles = () => {
    // Short durations (light blue)
    if (['1_day', '3_days'].includes(duration)) {
      return 'bg-[#EFF6FF] text-[#2563EB] border-[#93C5FD]';
    }
    
    // Medium durations (medium blue)
    if (['1_week', '2_weeks', '3_weeks'].includes(duration)) {
      return 'bg-[#DBEAFE] text-[#1D4ED8] border-[#60A5FA]';
    }
    
    // Long durations (dark blue)
    if (['4_weeks', '5_weeks', '6_weeks_plus'].includes(duration)) {
      return 'bg-[#BFDBFE] text-[#1E40AF] border-[#3B82F6]';
    }
    
    return 'bg-[#EFF6FF] text-[#2563EB] border-[#60A5FA]';
  };

  // Format duration for display (safely)
  const formattedDuration = typeof duration === 'string' 
    ? duration
        .replace(/_/g, ' ')
        .replace('plus', '+')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Unknown';

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getDurationStyles()}`}>
      <Clock className="h-3.5 w-3.5" />
      {formattedDuration}
    </Badge>
  );
};

export default DurationBadge;
