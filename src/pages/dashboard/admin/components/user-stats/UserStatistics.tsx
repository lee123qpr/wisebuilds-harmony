
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus, ShieldAlert, Users, UserX, Activity } from 'lucide-react';
import { UserCounts } from '../../hooks/useUsers';

interface UserStatisticsProps {
  userCounts: UserCounts;
}

const UserStatistics = ({ userCounts }: UserStatisticsProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>Overview of all registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard 
            title="Total Users" 
            count={userCounts.total} 
            icon={<User className="h-4 w-4 text-muted-foreground" />} 
          />
          <StatCard 
            title="Freelancers" 
            count={userCounts.freelancers} 
            icon={<UserPlus className="h-4 w-4 text-blue-500" />} 
          />
          <StatCard 
            title="Business Clients" 
            count={userCounts.businesses} 
            icon={<UserPlus className="h-4 w-4 text-green-500" />} 
          />
          <StatCard 
            title="Admins" 
            count={userCounts.admins} 
            icon={<ShieldAlert className="h-4 w-4 text-purple-500" />} 
          />
          <StatCard 
            title="Active Users" 
            count={userCounts.activeUsers} 
            icon={<Activity className="h-4 w-4 text-amber-500" />} 
          />
          <StatCard 
            title="Deleted Accounts" 
            count={userCounts.deletedAccounts} 
            icon={<UserX className="h-4 w-4 text-red-500" />} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Creating a smaller, more compact stat card component
interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, count, icon }: StatCardProps) => {
  return (
    <div className="p-4 bg-background rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default UserStatistics;
