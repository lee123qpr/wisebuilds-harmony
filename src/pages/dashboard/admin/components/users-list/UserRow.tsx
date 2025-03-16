
import React from 'react';
import { format } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminUser } from '../../hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

interface UserRowProps {
  user: AdminUser;
  getUserTypeColor: (userType: string) => string;
}

const UserRow = ({ user, getUserTypeColor }: UserRowProps) => {
  const { toast } = useToast();

  const handleViewProfile = () => {
    // Get user type
    const userType = user.user_metadata?.user_type;
    
    // Determine which route to use based on user type
    if (userType === 'freelancer') {
      // For freelancers, use the existing /dashboard/freelancer/profile route
      window.open(`/dashboard/freelancer/profile?id=${user.id}`, '_blank');
    } else if (userType === 'business') {
      // For businesses, use the existing /dashboard/business/profile route
      window.open(`/dashboard/business/profile?id=${user.id}`, '_blank');
    } else {
      // For admins or unknown types, show a toast notification
      toast({
        title: "Profile not available",
        description: `Profile view for ${userType || 'unknown'} users is not currently available.`,
        variant: "default"
      });
    }
  };

  return (
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
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewProfile}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
