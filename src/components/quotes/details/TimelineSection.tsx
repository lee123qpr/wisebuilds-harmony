
import React from 'react';
import { format } from 'date-fns';
import { Quote } from '@/types/quotes';

interface TimelineSectionProps {
  quote: Quote;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Timeline</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Start Date:</span>
          <span className="text-sm font-medium">
            {quote.available_start_date 
              ? format(new Date(quote.available_start_date), 'MMMM d, yyyy') 
              : 'Not specified'}
          </span>
          
          <span className="text-sm text-slate-600">Duration:</span>
          <span className="text-sm font-medium">
            {quote.estimated_duration && quote.duration_unit 
              ? `${quote.estimated_duration} ${quote.duration_unit}` 
              : 'Not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
