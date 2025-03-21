
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface QuoteTabsNavProps {
  tabCounts: {
    accepted: number;
    pending: number;
    declined: number;
  };
}

const QuoteTabsNav: React.FC<QuoteTabsNavProps> = ({ tabCounts }) => {
  return (
    <TabsList className="w-full">
      <TabsTrigger value="accepted" className="flex-1">
        Accepted ({tabCounts.accepted})
      </TabsTrigger>
      <TabsTrigger value="pending" className="flex-1">
        Pending ({tabCounts.pending})
      </TabsTrigger>
      <TabsTrigger value="declined" className="flex-1">
        Declined ({tabCounts.declined})
      </TabsTrigger>
    </TabsList>
  );
};

export default QuoteTabsNav;
