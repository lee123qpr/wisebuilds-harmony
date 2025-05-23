
import React from 'react';
import { CreditCard } from 'lucide-react';

interface CreditBalanceBadgeProps {
  creditBalance: number | null;
}

const CreditBalanceBadge = ({ creditBalance }: CreditBalanceBadgeProps) => {
  return (
    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="h-5 w-5 text-green-600" />
        <p className="text-gray-700 font-medium">Current Balance</p>
      </div>
      <p className="text-3xl font-bold text-green-600">{creditBalance} credits</p>
      <p className="text-xs text-gray-500 mt-1">Real-time updates enabled</p>
    </div>
  );
};

export default CreditBalanceBadge;
