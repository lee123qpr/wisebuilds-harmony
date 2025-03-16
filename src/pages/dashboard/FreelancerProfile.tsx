import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useFreelancerProfile } from './hooks/useFreelancerProfile';
import FreelancerProfileForm from './components/profile/FreelancerProfileForm';
import { Skeleton } from '@/components/ui/skeleton';

const FreelancerProfile = () => {
  const { user } = useAuth();
  const { profile, isLoadingProfile, saveProfile, isSaving } = useFreelancerProfile();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile</CardTitle>
          <CardDescription>You must be logged in to view your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please log in to continue.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-80 mb-2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Freelancer Profile</CardTitle>
        <CardDescription>Update your profile information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <FreelancerProfileForm
          initialValues={profile}
          isLoading={isSaving}
          onSubmitForm={saveProfile}
        />
      </CardContent>
    </Card>
  );
};

export default FreelancerProfile;
