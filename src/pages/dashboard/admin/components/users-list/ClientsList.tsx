
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import UserRow from './UserRow';
import { AdminUser } from '../../hooks/useUsers';

interface ClientsListProps {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ClientsList = ({ users, isLoading, error, onRefresh }: ClientsListProps) => {
  // Filter to only show clients (business type)
  const clients = users.filter(user => 
    user.user_metadata?.user_type === 'business'
  );

  const getUserTypeColor = (userType: string) => {
    return userType === 'business' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client List</CardTitle>
          <CardDescription>Manage business accounts</CardDescription>
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
        ) : clients.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No clients found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Email Status</TableHead>
                <TableHead>Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map(user => (
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

export default ClientsList;
