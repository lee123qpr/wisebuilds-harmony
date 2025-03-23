
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Coins, Briefcase } from 'lucide-react';

interface QuoteMetadataProps {
  formattedDate: string;
  priceType: string;
  formattedPrice: string;
  availableStartDate?: string;
}

const QuoteMetadata: React.FC<QuoteMetadataProps> = ({
  formattedDate,
  priceType,
  formattedPrice,
  availableStartDate
}) => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>Received on: {formattedDate}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Coins className="h-4 w-4" />
        <span>{priceType}: {formattedPrice}</span>
      </div>
      
      {availableStartDate && (
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          <span>Start date: {format(new Date(availableStartDate), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default QuoteMetadata;
