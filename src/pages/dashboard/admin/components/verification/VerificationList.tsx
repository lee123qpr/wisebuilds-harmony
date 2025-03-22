
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye, Loader2 } from 'lucide-react';
import { Verification } from '../../types';
import VerificationStatusBadge from './VerificationStatusBadge';

interface VerificationListProps {
  verifications: Verification[];
  isLoading: boolean;
  onViewDocument: (verification: Verification) => void;
}

const VerificationList: React.FC<VerificationListProps> = ({ 
  verifications, 
  isLoading, 
  onViewDocument 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification Requests</CardTitle>
        <CardDescription>Review and approve freelancer ID verification documents</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : verifications.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No verification requests found.</p>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{verification.user_full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{verification.user_full_name}</p>
                    <p className="text-sm text-muted-foreground">{verification.user_email}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <VerificationStatusBadge status={verification.status || verification.verification_status || 'pending'} />
                      <span className="text-xs text-muted-foreground">
                        Submitted: {verification.submitted_at ? format(new Date(verification.submitted_at), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDocument(verification)}
                  className="flex items-center"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationList;
