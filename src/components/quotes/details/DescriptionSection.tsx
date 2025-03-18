
import React from 'react';
import { Quote } from '@/types/quotes';

interface DescriptionSectionProps {
  quote: Quote;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Description</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <p className="text-sm whitespace-pre-wrap">{quote.description || 'No description provided.'}</p>
      </div>
    </div>
  );
};

export default DescriptionSection;
