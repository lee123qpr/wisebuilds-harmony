
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BackButton from '@/components/common/BackButton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Clock, Mail, MapPin, Phone, User, Globe } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientProfileData {
  id: string;
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  company_address: string | null;
  company_description: string | null;
  member_since: string | null;
  jobs_completed: number | null;
  logo_url: string | null;
}

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <BackButton />
          <div className="mt-6">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="grid gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !clientProfile) {
    return (
      <MainLayout>
        <div className="container max-w-4xl py-8">
          <BackButton />
          <div className="mt-6">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Client Profile Not Found</h2>
                <p className="text-red-600">
                  We couldn't find the client profile you're looking for. The client may have deleted their account or you may have followed an invalid link.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <BackButton />
        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-6">
            {clientProfile.company_name || clientProfile.contact_name || 'Client Profile'}
          </h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {clientProfile.contact_name && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Name</p>
                      <p className="font-medium">{clientProfile.contact_name}</p>
                    </div>
                  </div>
                )}
                
                {clientProfile.company_name && (
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Company</p>
                      <p className="font-medium">{clientProfile.company_name}</p>
                    </div>
                  </div>
                )}
                
                {clientProfile.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a href={`mailto:${clientProfile.email}`} className="font-medium text-blue-600 hover:underline">
                        {clientProfile.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {clientProfile.phone_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <a href={`tel:${clientProfile.phone_number}`} className="font-medium text-blue-600 hover:underline">
                        {clientProfile.phone_number}
                      </a>
                    </div>
                  </div>
                )}
                
                {clientProfile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Website</p>
                      <a href={clientProfile.website.startsWith('http') ? clientProfile.website : `https://${clientProfile.website}`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="font-medium text-blue-600 hover:underline">
                        {clientProfile.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {clientProfile.company_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="font-medium">{clientProfile.company_address}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(clientProfile.member_since)}</p>
                  </div>
                </div>
                
                {clientProfile.jobs_completed && clientProfile.jobs_completed > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 flex items-center justify-center text-gray-600 mt-0.5">✓</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                      <p className="font-medium">{clientProfile.jobs_completed}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {clientProfile.company_description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    About the Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{clientProfile.company_description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfileView;
