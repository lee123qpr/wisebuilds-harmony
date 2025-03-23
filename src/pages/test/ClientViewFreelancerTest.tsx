
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FreelancerProfileView from '@/pages/freelancer/FreelancerProfileView';

const ClientViewFreelancerTest = () => {
  const { user } = useAuth();
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [viewFreelancer, setViewFreelancer] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreelancerId(e.target.value);
  };

  const handleViewProfile = () => {
    if (freelancerId) {
      setViewFreelancer(true);
    }
  };

  const handleReset = () => {
    setViewFreelancer(false);
    setFreelancerId("");
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Client View of Freelancer Profile</h1>
          <p className="text-muted-foreground mb-4">
            Test how clients see freelancer profiles
          </p>
          <Separator className="my-4" />
        </div>

        {!viewFreelancer ? (
          <Card>
            <CardHeader>
              <CardTitle>Enter Freelancer ID</CardTitle>
              <CardDescription>
                Enter a freelancer ID to view their profile as a client would see it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="Freelancer ID"
                    value={freelancerId}
                    onChange={handleInputChange}
                  />
                </div>
                <Button onClick={handleViewProfile}>View Profile</Button>
              </div>
              
              {user && (
                <div className="mt-4">
                  <Button variant="outline" onClick={() => {
                    setFreelancerId(user.id);
                  }}>
                    Use Your ID ({user.id.substring(0, 8)}...)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleReset}>
              ← Back to ID Entry
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Profile View</CardTitle>
                <CardDescription>
                  This is how clients see a freelancer's profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FreelancerProfileView freelancerId={freelancerId} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientViewFreelancerTest;
