
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FreelancerProfile from '@/pages/dashboard/FreelancerProfile';

const FreelancerProfileTest = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Freelancer Profile Testing</h1>
          <p className="text-muted-foreground mb-4">
            Test view for freelancer profiles
          </p>
          <Separator className="my-4" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Freelancer Dashboard Profile</CardTitle>
            <CardDescription>This is what freelancers see when editing their profile</CardDescription>
          </CardHeader>
          <CardContent>
            <FreelancerProfile />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileTest;
