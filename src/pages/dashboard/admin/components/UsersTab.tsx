
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { User, UserPlus, Loader2, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    user_type?: string;
  };
}

const UsersTab = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    freelancers: 0,
    businesses: 0,
    admins: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a production app, this would use a secure admin API
      // For this demo, we're using direct access (which would be secured by RLS)
      const { data: { users: userData }, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      setUsers(userData as AdminUser[]);
      
      // Calculate counts
      const counts = userData.reduce((acc, user) => {
        acc.total++;
        const userType = user.user_metadata?.user_type;
        if (userType === 'freelancer') acc.freelancers++;
        else if (userType === 'business') acc.businesses++;
        else if (userType === 'admin') acc.admins++;
        return acc;
      }, { total: 0, freelancers: 0, businesses: 0, admins: 0 });
      
      setUserCounts(counts);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users. This is likely because you need admin privileges.'
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
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
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
