
import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, DollarSign, User } from 'lucide-react';

interface QuoteMetadataProps {
  formattedDate: string;
  roleFormatted: string;
  priceType: string;
  priceValue: string | number;
  availableStartDate?: string;
  estimatedDuration?: string;
  durationUnit?: string;
}

const QuoteMetadata: React.FC<QuoteMetadataProps> = ({
  formattedDate,
  roleFormatted,
  priceType,
  priceValue,
  availableStartDate,
  estimatedDuration,
  durationUnit
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Submitted on {formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <User className="h-4 w-4" />
          <span>Looking for: {roleFormatted}</span>
        </div>
      </div>
      
      <div className="line-clamp-3 text-sm">
        {/* Description goes here from parent component */}
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="border rounded-md p-3 flex flex-col">
          <span className="text-sm text-muted-foreground mb-1 flex items-center">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            {priceType}
          </span>
          <span className="font-medium">{priceValue}</span>
        </div>
        
        <div className="border rounded-md p-3 flex flex-col">
          <span className="text-sm text-muted-foreground mb-1 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Start Date
          </span>
          <span className="font-medium">
            {availableStartDate 
              ? format(new Date(availableStartDate), 'MMM d, yyyy')
              : 'Not specified'}
          </span>
        </div>
        
        <div className="border rounded-md p-3 flex flex-col">
          <span className="text-sm text-muted-foreground mb-1 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Duration
          </span>
          <span className="font-medium">
            {estimatedDuration && durationUnit
              ? `${estimatedDuration} ${durationUnit}`
              : 'Not specified'}
          </span>
        </div>
      </div>
    </>
  );
};

export default QuoteMetadata;
