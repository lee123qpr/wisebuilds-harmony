
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useClientProfile } from './hooks/useClientProfile';
import CompanyLogo from './components/profile/CompanyLogo';
import ProfileInfoTab from './components/profile/ProfileInfoTab';
import AccountSettingsTab from './components/account/AccountSettingsTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClientProfileAndSettings = () => {
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

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your company information and account settings in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar with company logo and stats */}
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

          {/* Right content area with all settings */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Profile & Account Management</CardTitle>
                <CardDescription>Update your company details and account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="profile">Business Information</TabsTrigger>
                    <TabsTrigger value="account">Account Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <ProfileInfoTab
                      form={form}
                      isSaving={isSaving}
                      onSubmit={saveProfile}
                    />
                  </TabsContent>
                  
                  <TabsContent value="account">
                    <AccountSettingsTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfileAndSettings;
