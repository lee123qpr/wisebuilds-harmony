
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FreelancerProfile from '@/pages/dashboard/FreelancerProfile';
import FreelancerProfileView from '@/pages/freelancer/FreelancerProfileView';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const FreelancerDetailedProfileTest = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("freelancer-view");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Freelancer Profile Testing</h1>
          <p className="text-muted-foreground mb-4">
            Compare how profiles look to freelancers vs clients
          </p>
          <Separator className="my-4" />
        </div>

        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>You need to be logged in to view this test page</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="freelancer-view">Freelancer Edit View</TabsTrigger>
              <TabsTrigger value="client-view">Client-facing View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="freelancer-view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Dashboard Profile</CardTitle>
                  <CardDescription>This is what freelancers see when editing their profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <FreelancerProfile />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="client-view" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client-facing Profile View</CardTitle>
                  <CardDescription>This is what clients see when viewing a freelancer's profile</CardDescription>
                </CardHeader>
                <CardContent>
                  {user && <FreelancerProfileView freelancerId={user.id} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default FreelancerDetailedProfileTest;
