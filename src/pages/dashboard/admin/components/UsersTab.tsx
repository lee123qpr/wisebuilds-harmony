
import React from 'react';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UserStatistics from './user-stats/UserStatistics';
import UsersList from './users-list/UsersList';
import { useUsers } from '../hooks/useUsers';

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
      <UsersList 
        users={users}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchUsers}
      />
    </div>
  );
};

export default UsersTab;
