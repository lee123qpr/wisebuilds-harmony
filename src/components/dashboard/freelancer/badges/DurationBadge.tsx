
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import AnyOptionBadge from './AnyOptionBadge';

interface DurationBadgeProps {
  duration: string;
}

const DurationBadge = ({ duration }: DurationBadgeProps) => {
  if (duration === 'any') {
    return <AnyOptionBadge label="Duration" />;
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

  // Format duration for display
  const formattedDuration = duration
    .replace('_', ' ')
    .replace('plus', '+')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getDurationStyles()}`}>
      <Clock className="h-3.5 w-3.5" />
      {formattedDuration}
    </Badge>
  );
};

export default DurationBadge;
