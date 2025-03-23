
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCards from './freelancer-cards/DashboardCards';
import ApplicationCards from './freelancer-cards/ApplicationCards';
import QuoteCards from './freelancer-cards/QuoteCards';
import ProfileCards from './freelancer-cards/ProfileCards';
import { getTestFreelancers } from './freelancer-cards/TestData';

const FreelancerProfileCardsTest = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const { 
    completeFreelancer,
    minimalFreelancer,
    newFreelancer,
    expertFreelancer,
    mockQuoteDate,
    mockProjectId
  } = getTestFreelancers();

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Freelancer Profile Cards Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page displays all the different freelancer profile card components used throughout the application
          with various data configurations to help ensure consistent design and functionality.
        </p>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="profile">Profile View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <DashboardCards 
              completeFreelancer={completeFreelancer}
              minimalFreelancer={minimalFreelancer}
              expertFreelancer={expertFreelancer}
              uploadingImage={uploadingImage}
              setUploadingImage={setUploadingImage}
            />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationCards
              completeFreelancer={completeFreelancer}
              minimalFreelancer={minimalFreelancer}
              newFreelancer={newFreelancer}
              expertFreelancer={expertFreelancer}
              mockProjectId={mockProjectId}
            />
          </TabsContent>
          
          <TabsContent value="quotes">
            <QuoteCards
              completeFreelancer={completeFreelancer}
              minimalFreelancer={minimalFreelancer}
              newFreelancer={newFreelancer}
              expertFreelancer={expertFreelancer}
              mockQuoteDate={mockQuoteDate}
            />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileCards
              completeFreelancer={completeFreelancer}
              minimalFreelancer={minimalFreelancer}
              newFreelancer={newFreelancer}
              expertFreelancer={expertFreelancer}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileCardsTest;
