
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Coins, Briefcase } from 'lucide-react';
import { QuoteWithFreelancer } from '@/types/quotes';

interface JobMetadataProps {
  quote: QuoteWithFreelancer;
  completedDate: string | null;
}

const JobMetadata: React.FC<JobMetadataProps> = ({ quote, completedDate }) => {
  const formattedDate = quote.created_at 
    ? format(new Date(quote.created_at), 'MMM d, yyyy')
    : 'Unknown date';
    
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
        
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  const formattedPrice = priceValue === 'Not specified' ? priceValue : `£${priceValue}`;
  
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>{completedDate ? `Completed on: ${completedDate}` : `Accepted on: ${formattedDate}`}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Coins className="h-4 w-4" />
        <span>{priceType}: {formattedPrice}</span>
      </div>
      
      {quote.available_start_date && (
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          <span>Start date: {format(new Date(quote.available_start_date), 'MMM d, yyyy')}</span>
        </div>
      )}
    </div>
  );
};

export default JobMetadata;
