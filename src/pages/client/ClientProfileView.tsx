
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import ClientProfileSkeleton from '@/components/client/profile/ClientProfileSkeleton';
import ClientProfileNotFound from '@/components/client/profile/ClientProfileNotFound';
import ClientInformationCard from '@/components/client/profile/ClientInformationCard';
import CompanyDescriptionCard from '@/components/client/profile/CompanyDescriptionCard';
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
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <BackButton />
          <ClientProfileNotFound />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <BackButton />
        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-6">
            {clientProfile.company_name || clientProfile.contact_name || 'Client Profile'}
          </h1>
          
          <div className="grid gap-6">
            <ClientInformationCard 
              clientProfile={clientProfile}
              formatDate={formatProfileDate}
            />
            
            {clientProfile.company_description && (
              <CompanyDescriptionCard description={clientProfile.company_description} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfileView;
