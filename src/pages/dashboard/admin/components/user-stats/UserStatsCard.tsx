
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface UserStatsCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor?: string;
}

const UserStatsCard = ({ title, count, icon: Icon, iconColor }: UserStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Icon className={`mr-2 h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
          <p className="text-3xl font-bold">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
