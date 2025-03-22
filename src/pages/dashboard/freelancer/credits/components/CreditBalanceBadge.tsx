
import React from 'react';

interface CreditBalanceBadgeProps {
  creditBalance: number | null;
}

const CreditBalanceBadge = ({ creditBalance }: CreditBalanceBadgeProps) => {
  return (
    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
      <p className="text-gray-700 font-medium">Current Balance</p>
      <p className="text-3xl font-bold text-green-600">{creditBalance} credits</p>
    </div>
  );
};

export default CreditBalanceBadge;
