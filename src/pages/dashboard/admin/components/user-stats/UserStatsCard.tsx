
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor?: string;
}

// This component is replaced by the inline StatCard in UserStatistics.tsx
const UserStatsCard = ({ title, count, icon: Icon, iconColor }: UserStatsCardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default UserStatsCard;
