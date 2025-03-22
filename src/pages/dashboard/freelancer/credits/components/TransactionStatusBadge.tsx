
import React, { useEffect } from 'react';
import { Clock, RefreshCcw } from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';

interface TransactionStatusBadgeProps {
  isTransactionPending: boolean;
  sessionId: string | null;
  onRefresh?: () => void;
}

const TransactionStatusBadge = ({ 
  isTransactionPending, 
  sessionId,
  onRefresh 
}: TransactionStatusBadgeProps) => {
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    // Add initial notification for pending transaction
    if (isTransactionPending && sessionId) {
      addNotification({
        type: 'payment',
        title: 'Payment Processing',
        description: 'Your credit purchase is being processed'
      });
    }
  }, [isTransactionPending, sessionId, addNotification]);

  // Only show first 4 and last 4 characters of session ID for security
  const maskedSessionId = sessionId 
    ? `${sessionId.substring(0, 4)}...${sessionId.substring(sessionId.length - 4)}`
    : 'Not available';
    
  return (
    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-700 font-medium">Refreshing your balance...</p>
          <p className="text-sm text-gray-500 mb-2">
            If your credits don't appear, please click the refresh button.
          </p>
          {isTransactionPending && (
            <p className="text-sm font-medium text-orange-600 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Your payment is still processing. This may take a moment.
            </p>
          )}
          <p className="text-xs text-gray-400">
            (Transaction ID: {maskedSessionId})
          </p>
        </div>
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
            aria-label="Refresh status"
          >
            <RefreshCcw className="h-4 w-4 text-yellow-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusBadge;
