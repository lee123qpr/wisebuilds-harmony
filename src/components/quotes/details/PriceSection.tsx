
import React from 'react';
import { Quote } from '@/types/quotes';

interface PriceSectionProps {
  quote: Quote;
}

const PriceSection: React.FC<PriceSectionProps> = ({ quote }) => {
  // Determine which price type was used
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  
  // Format the price value with a pound sign if it's a number
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate;
  const formattedPrice = typeof priceValue === 'number' || !isNaN(Number(priceValue))
    ? `£${priceValue}`
    : 'Not specified';

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Price Details</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Price Type:</span>
          <span className="text-sm font-medium">{priceType}</span>
          
          <span className="text-sm text-slate-600">Amount:</span>
          <span className="text-sm font-medium">{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
