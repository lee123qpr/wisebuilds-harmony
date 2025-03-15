
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CreditTransaction } from '@/hooks/useCredits';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: CreditTransaction[] | undefined;
  isLoading: boolean;
}

const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent credit purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 animate-pulse">
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent credit purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent credit purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction) => {
            const statusIcon = {
              pending: <Clock className="h-4 w-4" />,
              completed: <Check className="h-4 w-4" />,
              failed: <X className="h-4 w-4" />
            };
            
            const statusColor = {
              pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
              completed: "bg-green-100 text-green-800 border-green-200",
              failed: "bg-red-100 text-red-800 border-red-200"
            };
            
            return (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div className="font-medium">
                    {transaction.credits_purchased} credits
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium">
                    £{(transaction.amount / 100).toFixed(2)}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${statusColor[transaction.status]}`}
                  >
                    {statusIcon[transaction.status]}
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
