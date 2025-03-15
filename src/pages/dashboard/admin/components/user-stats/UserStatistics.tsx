
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, UserPlus, ShieldAlert } from 'lucide-react';
import UserStatsCard from './UserStatsCard';
import { UserCounts } from '../../hooks/useUsers';

interface UserStatisticsProps {
  userCounts: UserCounts;
}

const UserStatistics = ({ userCounts }: UserStatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>Overview of all registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <UserStatsCard 
            title="Total Users" 
            count={userCounts.total} 
            icon={User} 
          />
          <UserStatsCard 
            title="Freelancers" 
            count={userCounts.freelancers} 
            icon={UserPlus} 
            iconColor="text-blue-500" 
          />
          <UserStatsCard 
            title="Business Clients" 
            count={userCounts.businesses} 
            icon={UserPlus} 
            iconColor="text-green-500" 
          />
          <UserStatsCard 
            title="Admins" 
            count={userCounts.admins} 
            icon={ShieldAlert} 
            iconColor="text-purple-500" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatistics;
