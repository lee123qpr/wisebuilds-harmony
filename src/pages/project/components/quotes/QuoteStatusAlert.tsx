
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Quote } from '@/types/quotes';

interface QuoteStatusAlertProps {
  status: Quote['status'];
}

const QuoteStatusAlert: React.FC<QuoteStatusAlertProps> = ({ status }) => {
  if (status === 'accepted') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-700">
          You've accepted this quote. The freelancer has been notified and you can now proceed with getting the freelancer to complete the work in the timeframe required.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'declined') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertDescription className="text-red-700">
          You've declined this quote. The freelancer has been notified.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default QuoteStatusAlert;
