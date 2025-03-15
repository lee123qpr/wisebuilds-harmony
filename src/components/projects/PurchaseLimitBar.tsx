
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Tally1, Tally2, Tally3, Tally4, Tally5 } from 'lucide-react';

interface PurchaseLimitBarProps {
  purchasesCount: number;
  limit?: number;
}

const PurchaseLimitBar: React.FC<PurchaseLimitBarProps> = ({
  purchasesCount,
  limit = 5
}) => {
  const percentage = (purchasesCount / limit) * 100;
  
  const getTallyIcon = () => {
    switch (purchasesCount) {
      case 0:
        return null;
      case 1:
        return <Tally1 className="h-4 w-4 mr-1" />;
      case 2:
        return <Tally2 className="h-4 w-4 mr-1" />;
      case 3:
        return <Tally3 className="h-4 w-4 mr-1" />;
      case 4:
        return <Tally4 className="h-4 w-4 mr-1" />;
      case 5:
      default:
        return <Tally5 className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          {getTallyIcon()}
          <span>{purchasesCount} of {limit} purchases</span>
        </div>
        {purchasesCount >= limit && (
          <span className="text-amber-600 font-medium">Limit reached</span>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default PurchaseLimitBar;
