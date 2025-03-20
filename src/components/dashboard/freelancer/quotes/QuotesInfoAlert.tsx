
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface QuotesInfoAlertProps {
  acceptedCount: number;
}

const QuotesInfoAlert: React.FC<QuotesInfoAlertProps> = ({ acceptedCount }) => {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600 mr-2" />
      <AlertDescription className="text-blue-800">
        You've purchased these leads and can now access their full project details and contact information. 
        Use the action buttons to view details, message clients, or create quotes.
        {acceptedCount > 0 && (
          <span className="font-medium"> You have been hired for {acceptedCount} project{acceptedCount > 1 ? 's' : ''}!</span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default QuotesInfoAlert;
