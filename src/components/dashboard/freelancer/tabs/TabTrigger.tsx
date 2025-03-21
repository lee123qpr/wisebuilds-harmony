
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";

interface TabTriggerProps {
  value: string;
  label: string;
  badgeCount?: number;
  showNotification?: boolean;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  label,
  badgeCount,
  showNotification
}) => {
  return (
    <TabsTrigger
      value={value}
      badgeCount={badgeCount}
      showNotification={showNotification}
    >
      {label}
    </TabsTrigger>
  );
};
