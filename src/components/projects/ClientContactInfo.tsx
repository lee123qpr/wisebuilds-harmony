
import React from 'react';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useContactInfo } from '@/hooks/leads/useContactInfo';
import { Card, CardContent } from '@/components/ui/card';
import ContactInfoContent from './contact/ContactInfoContent';
import NextStepsTips from './contact/NextStepsTips';
import ContactInfoActions from './contact/ContactInfoActions';

interface ClientContactInfoProps {
  projectId: string;
}

const ClientContactInfo: React.FC<ClientContactInfoProps> = ({ projectId }) => {
  const { clientInfo, isLoading, error } = useContactInfo(projectId);
  
  console.log('ClientContactInfo rendering with:', { clientInfo, isLoading, error });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-green-800 font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Client Contact Information
          </h3>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-red-800">Error loading client information: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!clientInfo) {
    return (
      <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-yellow-800">Client information is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-green-800 font-semibold flex items-center gap-2 pb-2 border-b border-green-100">
          <User className="h-5 w-5 text-green-700" />
          Client Contact Information
        </h3>
        
        <ContactInfoContent clientInfo={clientInfo} />
        
        <NextStepsTips />
        
        <ContactInfoActions 
          projectId={projectId}
          clientId={clientInfo.user_id}
        />
      </CardContent>
    </Card>
  );
};

export default ClientContactInfo;
