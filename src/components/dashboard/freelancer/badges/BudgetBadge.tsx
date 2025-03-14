
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface BudgetBadgeProps {
  budget: string;
}

const BudgetBadge = ({ budget }: BudgetBadgeProps) => {
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

  // Format budget text from constants
  const getBudgetText = () => {
    switch (budget) {
      case '0-500': return '£0-£500';
      case '500-1000': return '£500-£1,000';
      case '1000-2500': return '£1,000-£2,500';
      case '2500-5000': return '£2,500-£5,000';
      case '5000-10000': return '£5,000-£10,000';
      case '10000_plus': return '£10,000+';
      default: 
        return budget
          .replace(/_/g, ' ')
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 py-1.5 px-3 ${getBudgetStyles()}`}>
      <Tag className="h-3.5 w-3.5" />
      {getBudgetText()}
    </Badge>
  );
};

export default BudgetBadge;
