
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useClientProfile } from './hooks/useClientProfile';
import CompanyLogo from './components/profile/CompanyLogo';
import ProfileInfoTab from './components/profile/ProfileInfoTab';
import ReviewsTab from './components/profile/ReviewsTab';

const ClientProfile = () => {
  const { user } = useAuth();
  console.log('ClientProfile - Auth user:', user);
  
  const {
    form,
    isLoading,
    isSaving,
    logoUrl,
    uploadingLogo,
    setUploadingLogo,
    setLogoUrl,
    saveProfile,
    memberSince,
    emailVerified,
    jobsCompleted
  } = useClientProfile(user);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  console.log('ClientProfile - Profile data:', { 
    logoUrl, 
    memberSince, 
    emailVerified, 
    jobsCompleted,
    userId: user?.id
  });

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
            <p className="text-muted-foreground">Manage your business information and reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CompanyLogo
              logoUrl={logoUrl}
              uploadingLogo={uploadingLogo}
              setUploadingLogo={setUploadingLogo}
              setLogoUrl={setLogoUrl}
              companyName={form.watch('companyName')}
              contactName={form.watch('contactName')}
              userId={user?.id || ''}
              memberSince={memberSince}
              emailVerified={emailVerified}
              jobsCompleted={jobsCompleted}
            />
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileInfoTab
                  form={form}
                  isSaving={isSaving}
                  onSubmit={saveProfile}
                />
              </TabsContent>
              
              <TabsContent value="reviews">
                <ReviewsTab userId={user?.id || ''} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfile;
