
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PurchaseLimitBarProps {
  purchasesCount: number;
  limit?: number;
  isPurchased?: boolean;
}

const PurchaseLimitBar: React.FC<PurchaseLimitBarProps> = ({
  purchasesCount,
  limit = 5,
  isPurchased = false
}) => {
  const percentage = (purchasesCount / limit) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <span>{purchasesCount} of {limit} purchases</span>
        </div>
        {isPurchased && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-xs">
            <Check className="h-3 w-3" />
            Purchased
          </Badge>
        )}
        {!isPurchased && purchasesCount >= limit && (
          <span className="text-amber-600 font-medium">Limit reached</span>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default PurchaseLimitBar;
