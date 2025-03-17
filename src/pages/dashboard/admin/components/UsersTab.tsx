
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';
import UserStatistics from './user-stats/UserStatistics';
import UsersList from './users-list/UsersList';
import FreelancersList from './users-list/FreelancersList';
import ClientsList from './users-list/ClientsList';
import { useUsers } from '../hooks/useUsers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const UsersTab = () => {
  const { users, isLoading, error, userCounts, fetchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const fullName = user.user_metadata?.full_name || '';
    const email = user.email || '';
    const query = searchQuery.toLowerCase();
    
    return fullName.toLowerCase().includes(query) || 
           email.toLowerCase().includes(query);
  });

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
      
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <UsersList 
            users={filteredUsers}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchUsers}
          />
        </TabsContent>
        
        <TabsContent value="freelancers" className="mt-6">
          <FreelancersList 
            users={filteredUsers}
            isLoading={isLoading}
            error={error}
            onRefresh={fetchUsers}
          />
        </TabsContent>
        
        <TabsContent value="clients" className="mt-6">
          <ClientsList 
            users={filteredUsers}
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
