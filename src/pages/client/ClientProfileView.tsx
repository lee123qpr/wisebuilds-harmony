
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ClientProfileSkeleton from '@/components/client/profile/ClientProfileSkeleton';
import ClientProfileNotFound from '@/components/client/profile/ClientProfileNotFound';
import ClientInformationCard from '@/components/client/profile/ClientInformationCard';
import CompanyDescriptionCard from '@/components/client/profile/CompanyDescriptionCard';
import { ClientProfileData } from './types';

const ClientProfileView = () => {
  const { clientId } = useParams<{ clientId: string }>();

  const { data: clientProfile, isLoading, error } = useQuery({
    queryKey: ['clientProfile', clientId],
    queryFn: async () => {
      if (!clientId) throw new Error('No client ID provided');
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (error) throw error;
      return data as ClientProfileData;
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
  };

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
              formatDate={formatDate}
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
