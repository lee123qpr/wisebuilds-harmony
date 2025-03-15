
import React from 'react';
import { format } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminUser } from '../../hooks/useUsers';

interface UserRowProps {
  user: AdminUser;
  getUserTypeColor: (userType: string) => string;
}

const UserRow = ({ user, getUserTypeColor }: UserRowProps) => {
  const handleViewProfile = () => {
    // Open in new tab according to user type
    const userType = user.user_metadata?.user_type;
    let profileUrl = '';
    
    if (userType === 'freelancer') {
      profileUrl = `/dashboard/freelancer/profile/${user.id}`;
    } else if (userType === 'business') {
      profileUrl = `/dashboard/client/profile/${user.id}`;
    } else {
      // For admin or unknown types, just show basic profile
      profileUrl = `/dashboard/profile/${user.id}`;
    }
    
    window.open(profileUrl, '_blank');
  };

  // Determine ID verification status for freelancers
  const renderIdVerificationStatus = () => {
    if (user.user_metadata?.user_type !== 'freelancer') {
      return <span className="text-gray-400">N/A</span>;
    }

    const status = user.verification_status || 'unknown';
    
    if (status === 'approved') {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          <span>Verified</span>
        </div>
      );
    } else if (status === 'pending') {
      return (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
          <span>Pending</span>
        </div>
      );
    } else if (status === 'rejected') {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-red-500 mr-1" />
          <span>Rejected</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <XCircle className="h-4 w-4 text-gray-500 mr-1" />
          <span>Not Verified</span>
        </div>
      );
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
      {user.user_metadata?.user_type === 'freelancer' && (
        <TableCell>
          {renderIdVerificationStatus()}
        </TableCell>
      )}
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
