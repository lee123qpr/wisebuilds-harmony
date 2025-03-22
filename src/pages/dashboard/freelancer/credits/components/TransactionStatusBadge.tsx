
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface TransactionStatusBadgeProps {
  isTransactionPending: boolean;
  sessionId: string | null;
}

const TransactionStatusBadge = ({ isTransactionPending, sessionId }: TransactionStatusBadgeProps) => {
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
        (Transaction ID: {sessionId ? sessionId.slice(0, 12) + '...' : 'Not available'})
      </p>
    </div>
  );
};

export default TransactionStatusBadge;
