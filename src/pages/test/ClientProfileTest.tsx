
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ClientProfile from '@/pages/dashboard/ClientProfile';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const ClientProfileTest = () => {
  const { user, isLoading } = useAuth();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Client Profile Testing</h1>
          <p className="text-muted-foreground mb-4">
            Test view for client profiles
          </p>
          <Separator className="my-4" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>You need to be logged in to view this test page</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Client Dashboard Profile</CardTitle>
              <CardDescription>This is what clients see when editing their profile</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientProfile />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientProfileTest;
