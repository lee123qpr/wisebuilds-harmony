
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import ClientProfileSkeleton from '@/components/client/profile/ClientProfileSkeleton';
import ClientProfileNotFound from '@/components/client/profile/ClientProfileNotFound';
import ClientProfileCard from '@/components/client/profile/ClientProfileCard';
import ClientProfileTabs from '@/components/client/profile/ClientProfileTabs';
import { useClientProfile, formatProfileDate } from '@/hooks/clients/useClientProfile';
import { useToast } from '@/hooks/use-toast';

const ClientProfileView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: clientProfile, isLoading, error, isError } = useClientProfile(clientId);
  const { toast } = useToast();

  console.log('ClientProfileView rendering with:', { 
    clientId, 
    isLoading, 
    isError, 
    error: error?.message, 
    hasData: !!clientProfile 
  });

  React.useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading profile",
        description: error.message || "Could not load client profile",
        variant: "destructive"
      });
    }
  }, [isError, error, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-5xl py-8">
          <BackButton />
          <ClientProfileSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (isError || !clientProfile) {
    console.error('Error loading client profile:', error);
    return <ClientProfileNotFound />;
  }

  return (
    <MainLayout>
      <div className="container max-w-5xl py-8 px-4 sm:px-6 animate-fade-in">
        <BackButton />
        
        <div className="mb-6">
          <ClientProfileCard 
            clientProfile={clientProfile}
            formatDate={formatProfileDate}
          />
        </div>
        
        <ClientProfileTabs 
          clientProfile={clientProfile}
          formatDate={formatProfileDate}
        />
      </div>
    </MainLayout>
  );
};

export default ClientProfileView;
