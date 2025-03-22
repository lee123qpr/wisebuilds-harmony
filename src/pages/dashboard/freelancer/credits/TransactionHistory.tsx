
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CreditTransaction } from '@/hooks/credits/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X, CreditCard } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

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

  // Status icons for each transaction state
  const statusIcon = {
    pending: <Clock className="h-4 w-4" />,
    completed: <Check className="h-4 w-4" />,
    failed: <X className="h-4 w-4" />
  };
  
  // Status colors for each transaction state
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent credit purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{transaction.credits_purchased}</span>
                  </div>
                </TableCell>
                <TableCell>£{(transaction.amount / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${statusColor[transaction.status]}`}
                  >
                    {statusIcon[transaction.status]}
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
