import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { User, UserPlus, Loader2, CheckCircle, XCircle, ShieldAlert, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    user_type?: string;
  };
  is_verified?: boolean;
  email_confirmed_at?: string | null;
}

interface UserCounts {
  total: number;
  freelancers: number;
  businesses: number;
  admins: number;
}

const UsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<UserCounts>({
    total: 0,
    freelancers: 0,
    businesses: 0,
    admins: 0
  });
  const { toast } = useToast();
  const { user: currentUser, session } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get session token from the current session
      if (!session?.access_token) {
        throw new Error('No authentication token available');
      }
      
      // Call our secure edge function with the access token
      const response = await supabase.functions.invoke('get-admin-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch users');
      }
      
      const userData = response.data?.users || [];
      
      const formattedUsers: AdminUser[] = userData.map((user: any) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at || '',
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata || { full_name: '', user_type: '' },
        is_verified: !!user.email_confirmed_at,
        email_confirmed_at: user.email_confirmed_at
      }));
      
      setUsers(formattedUsers);
      
      // Calculate counts
      const counts: UserCounts = {
        total: formattedUsers.length,
        freelancers: 0,
        businesses: 0,
        admins: 0
      };
      
      formattedUsers.forEach(user => {
        const userType = user.user_metadata?.user_type;
        if (userType === 'freelancer') counts.freelancers++;
        else if (userType === 'business') counts.businesses++;
        else if (userType === 'admin') counts.admins++;
      });
      
      setUserCounts(counts);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to load users. Admin privileges required.'
      });
      // Set empty array to handle error gracefully
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>Overview of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="text-3xl font-bold">{userCounts.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Freelancers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-blue-500" />
                  <p className="text-3xl font-bold">{userCounts.freelancers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Business Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-green-500" />
                  <p className="text-3xl font-bold">{userCounts.businesses}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />
                  <p className="text-3xl font-bold">{userCounts.admins}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User List</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
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
                    <TableCell>
                      <Badge className={getUserTypeColor(user.user_metadata?.user_type || 'unknown')}>
                        {user.user_metadata?.user_type || 'Unknown'}
                      </Badge>
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
                        {user.is_verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
