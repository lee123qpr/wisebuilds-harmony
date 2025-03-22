
import React from 'react';
import { Quote } from '@/types/quotes';

interface PaymentSectionProps {
  quote: Quote;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Payment Details</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Payment Method:</span>
          <span className="text-sm font-medium">
            {quote.preferred_payment_method || 'Not specified'}
          </span>
          
          <span className="text-sm text-slate-600">Payment Terms:</span>
          <span className="text-sm font-medium">
            {quote.payment_terms || 'Not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
