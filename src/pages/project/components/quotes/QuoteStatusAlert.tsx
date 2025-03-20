
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Quote } from '@/types/quotes';
import { useAuth } from '@/context/AuthContext';

interface QuoteStatusAlertProps {
  status: Quote['status'];
  isFreelancer?: boolean;
}

const QuoteStatusAlert: React.FC<QuoteStatusAlertProps> = ({ status, isFreelancer = false }) => {
  const { user } = useAuth();
  const userType = user?.user_metadata?.user_type;
  
  // Handle freelancer view
  if (isFreelancer || userType === 'freelancer') {
    if (status === 'accepted') {
      return (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            Congratulations! Your quote has been accepted by the client. You can now proceed with the work based on the agreed terms. This job now appears in your "Active Jobs" tab.
          </AlertDescription>
        </Alert>
      );
    }

    if (status === 'declined') {
      return (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-700">
            Your quote has been declined by the client. You may want to reach out to understand their decision or look for other opportunities.
          </AlertDescription>
        </Alert>
      );
    }
  }
  
  // Handle client view
  else {
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
  }

  return null;
};

export default QuoteStatusAlert;
