
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import UserStatistics from './user-stats/UserStatistics';
import UsersList from './users-list/UsersList';
import FreelancersList from './users-list/FreelancersList';
import ClientsList from './users-list/ClientsList';
import { useUsers } from '../hooks/useUsers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UsersTab = () => {
  const { users, isLoading, error, userCounts, fetchUsers } = useUsers();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <UserStatistics userCounts={userCounts} />
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <UsersList 
            users={users}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchUsers}
          />
        </TabsContent>
        
        <TabsContent value="freelancers" className="mt-6">
          <FreelancersList 
            users={users}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchUsers}
          />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <ClientsList 
            users={users}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchUsers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersTab;
