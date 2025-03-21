
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TabCounts {
  accepted: number;
  pending: number;
  declined: number;
}

interface QuoteTabsNavProps {
  tabCounts: TabCounts;
}

const QuoteTabsNav: React.FC<QuoteTabsNavProps> = ({ tabCounts }) => {
  return (
    <div className="border-b pb-2 mb-4">
      <TabsList>
        <TabsTrigger value="accepted">
          Accepted
          <Badge variant="secondary" className="ml-2">
            {tabCounts.accepted}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          <Badge variant="secondary" className="ml-2">
            {tabCounts.pending}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="declined">
          Declined
          <Badge variant="secondary" className="ml-2">
            {tabCounts.declined}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default QuoteTabsNav;
