
import React from 'react';
import { Clock } from 'lucide-react';

interface TransactionStatusBadgeProps {
  isTransactionPending: boolean;
  sessionId: string | null;
}

const TransactionStatusBadge = ({ isTransactionPending, sessionId }: TransactionStatusBadgeProps) => {
  // Only show first 4 and last 4 characters of session ID for security
  const maskedSessionId = sessionId 
    ? `${sessionId.substring(0, 4)}...${sessionId.substring(sessionId.length - 4)}`
    : 'Not available';
    
  return (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <p className="text-gray-700 font-medium">Refreshing your balance...</p>
      <p className="text-sm text-gray-500 mb-2">
        If your credits don't appear, please click the refresh button below.
      </p>
      {isTransactionPending && (
        <p className="text-sm font-medium text-orange-600 mb-2">
          Your payment is still processing. This may take a moment.
        </p>
      )}
      <p className="text-xs text-gray-400">
        (Transaction ID: {maskedSessionId})
      </p>
    </div>
  );
};

export default TransactionStatusBadge;
