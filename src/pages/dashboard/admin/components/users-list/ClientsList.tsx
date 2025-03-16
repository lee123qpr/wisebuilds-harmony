
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Eye, ArrowUpDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { AdminUser } from '../../hooks/useUsers';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface ClientsListProps {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ClientsList = ({ users, isLoading, error, onRefresh }: ClientsListProps) => {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: 'created_at' | 'last_sign_in_at' | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'descending'
  });
  
  // Filter only business users
  const clients = users.filter(user => 
    user.user_metadata?.user_type === 'business'
  );

  const handleViewProfile = (userId: string) => {
    window.open(`/dashboard/business/profile?id=${userId}`, '_blank');
  };

  const handleSort = (key: 'created_at' | 'last_sign_in_at') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedClients = React.useMemo(() => {
    if (!sortConfig.key) return clients;
    
    return [...clients].sort((a, b) => {
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
  }, [clients, sortConfig]);

  const getSortIndicator = (key: 'created_at' | 'last_sign_in_at') => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client List</CardTitle>
          <CardDescription>Manage business client accounts</CardDescription>
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
          <p className="text-center py-8 text-muted-foreground">No business clients found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company/User</TableHead>
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
                <TableHead>Email Status</TableHead>
                <TableHead>Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.user_metadata?.full_name || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy')
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.email_confirmed_at ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span>
                        {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewProfile(user.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientsList;
