import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { AdminUser } from '../../hooks/useUsers';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FreelancersListProps {
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const FreelancersList = ({ users, isLoading, error, onRefresh }: FreelancersListProps) => {
  const { toast } = useToast();
  
  // Filter only freelancer users
  const freelancers = users.filter(user => 
    user.user_metadata?.user_type === 'freelancer'
  );

  const getVerificationIcon = (status: string | null | undefined) => {
    if (!status) return <ShieldQuestion className="h-4 w-4 text-gray-500" />;
    
    switch (status) {
      case 'approved':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Shield className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      default:
        return <ShieldQuestion className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVerificationText = (status: string | null | undefined) => {
    if (!status) return 'Not Submitted';
    
    switch (status) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  const getVerificationColor = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewProfile = (userId: string) => {
    window.open(`/dashboard/freelancer/profile?id=${userId}`, '_blank');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Freelancer List</CardTitle>
          <CardDescription>Manage freelancer accounts and permissions</CardDescription>
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
        ) : freelancers.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No freelancers found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Email Status</TableHead>
                <TableHead>ID Verified</TableHead>
                <TableHead>Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {freelancers.map(user => (
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
                  <TableCell>
                    <Badge className={`flex items-center gap-1 ${getVerificationColor(user.verification_status)}`}>
                      {getVerificationIcon(user.verification_status)}
                      {getVerificationText(user.verification_status)}
                    </Badge>
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

export default FreelancersList;
