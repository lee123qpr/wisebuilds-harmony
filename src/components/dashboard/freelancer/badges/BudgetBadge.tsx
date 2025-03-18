
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag, Filter } from 'lucide-react';
import { formatBudget } from '@/utils/projectFormatters';

interface BudgetBadgeProps {
  budget: string;
}

const BudgetBadge = ({ budget }: BudgetBadgeProps) => {
  if (budget === 'any') {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]">
        <Filter className="h-3.5 w-3.5" />
        Any Budget
      </Badge>
    );
  }
  
  const getBudgetStyles = () => {
    // Lower budget range (light green)
    if (['0-500', '500-1000'].includes(budget)) {
      return 'bg-[#ECFDF5] text-[#059669] border-[#6EE7B7]';
    }
    
    // Medium budget range (medium green)
    if (['1000-2500', '2500-5000'].includes(budget)) {
      return 'bg-[#D1FAE5] text-[#047857] border-[#34D399]';
    }
    
    // Higher budget range (dark green)
    if (['5000-10000', '10000_plus'].includes(budget)) {
      return 'bg-[#A7F3D0] text-[#065F46] border-[#10B981]';
    }
    
    return 'bg-[#D1FAE5] text-[#047857] border-[#34D399]';
  };

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getBudgetStyles()}`}>
      <Tag className="h-3.5 w-3.5" />
      {formatBudget(budget)}
    </Badge>
  );
};

export default BudgetBadge;
