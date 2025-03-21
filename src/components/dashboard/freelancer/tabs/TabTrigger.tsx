
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";

interface TabTriggerProps {
  value: string;
  label: string;
  badgeCount?: number;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  label,
  badgeCount,
}) => {
  return (
    <TabsTrigger
      value={value}
      badgeCount={badgeCount}
    >
      {label}
    </TabsTrigger>
  );
};
