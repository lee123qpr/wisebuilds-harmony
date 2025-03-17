
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, ArrowUpDown } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import UserRow from './UserRow';
import { AdminUser } from '../../hooks/useUsers';

interface UsersListProps {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const UsersList = ({ users, isLoading, error, onRefresh }: UsersListProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: 'created_at' | 'last_sign_in_at' | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'descending'
  });

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': 
        return 'bg-purple-500';
      case 'freelancer': 
        return 'bg-blue-500';
      case 'business': 
        return 'bg-green-500';
      default: 
        return 'bg-gray-500';
    }
  };

  const handleSort = (key: 'created_at' | 'last_sign_in_at') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;
    
    return [...users].sort((a, b) => {
      // Handle null values for last_sign_in_at
      if (sortConfig.key === 'last_sign_in_at') {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        if (!b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      
      const aValue = a[sortConfig.key] ? new Date(a[sortConfig.key]).getTime() : 0;
      const bValue = b[sortConfig.key] ? new Date(b[sortConfig.key]).getTime() : 0;
      
      if (sortConfig.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [users, sortConfig]);

  const getSortIndicator = (key: 'created_at' | 'last_sign_in_at') => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No users found or you don't have permission to view users.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Created
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                    <span className="ml-1">{getSortIndicator('created_at')}</span>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => handleSort('last_sign_in_at')}
                >
                  <div className="flex items-center">
                    Last Login
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                    <span className="ml-1">{getSortIndicator('last_sign_in_at')}</span>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map(user => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  getUserTypeColor={getUserTypeColor} 
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
