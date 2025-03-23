
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import ClientProfileSkeleton from '@/components/client/profile/ClientProfileSkeleton';
import ClientProfileNotFound from '@/components/client/profile/ClientProfileNotFound';
import ClientInformationCard from '@/components/client/profile/ClientInformationCard';
import CompanyDescriptionCard from '@/components/client/profile/CompanyDescriptionCard';
import ClientDetailsSection from '@/components/client/profile/ClientDetailsSection';
import ClientHeaderSection from '@/components/client/profile/ClientHeaderSection';
import { useClientProfile, formatProfileDate } from '@/hooks/clients/useClientProfile';

const ClientProfileView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: clientProfile, isLoading, error } = useClientProfile(clientId);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <BackButton />
          <ClientProfileSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !clientProfile) {
    return <ClientProfileNotFound />;
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <BackButton />
        
        <ClientHeaderSection clientProfile={clientProfile} />
        
        <div className="mt-6 grid gap-6">
          <ClientInformationCard 
            clientProfile={clientProfile}
            formatDate={formatProfileDate}
          />
          
          {clientProfile.company_description && (
            <CompanyDescriptionCard description={clientProfile.company_description} />
          )}
          
          <ClientDetailsSection clientProfile={clientProfile} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfileView;
