
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dashboard profile card
import DashboardFreelancerProfileCard from '@/pages/dashboard/components/profile/FreelancerProfileCard';

// Project applications card
import ApplicationFreelancerCard from '@/components/applications/FreelancerApplicationCard';

// Project quotes card
import QuoteFreelancerProfileCard from '@/pages/project/components/quotes/FreelancerProfileCard';

// Messages freelancer profile
import MessagesFreelancerProfile from '@/components/quotes/components/FreelancerProfile';

// Quotes table freelancer info cell
import FreelancerInfoCell from '@/components/quotes/table/FreelancerInfoCell';

// Freelancer profile view header
import FreelancerProfileHeader from '@/pages/freelancer/components/FreelancerProfileHeader';

// Freelancer avatar component
import FreelancerAvatar from '@/components/applications/FreelancerAvatar';

const FreelancerProfileCardsTest = () => {
  // Mock data for testing the profile cards
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const mockFreelancer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    display_name: 'John Carpenter',
    first_name: 'John',
    last_name: 'Carpenter',
    profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Independent Contractor',
    email_verified: true,
    verified: true,
    rating: 4.7,
    reviews_count: 12,
    skills: ['Carpentry', 'Woodworking', 'Furniture Making', 'Cabinet Installation'],
    location: 'London, UK',
    member_since: '2022-05-15',
    jobs_completed: 24,
    bio: 'Professional carpenter with over 10 years of experience in custom woodworking and furniture making.',
    email: 'john.carpenter@example.com',
    phone_number: '+44 7700 900123'
  };

  const mockQuoteDate = new Date().toISOString();
  const mockProjectId = 'project-123';

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Freelancer Profile Cards Test Page</h1>
        <p className="text-muted-foreground mb-8">
          This page displays all the different freelancer profile card components used throughout the application
          to help ensure consistent design and functionality.
        </p>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="profile">Profile View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Freelancer Profile Card</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardFreelancerProfileCard
                  profileImage={mockFreelancer.profile_photo}
                  uploadingImage={uploadingImage}
                  setUploadingImage={setUploadingImage}
                  setProfileImage={() => {}}
                  fullName={mockFreelancer.display_name}
                  profession={mockFreelancer.job_title}
                  userId={mockFreelancer.id}
                  memberSince={mockFreelancer.member_since}
                  emailVerified={mockFreelancer.email_verified}
                  jobsCompleted={mockFreelancer.jobs_completed}
                  idVerified={mockFreelancer.verified}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Applications Freelancer Card</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationFreelancerCard
                  application={{
                    id: 'app-123',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    user_id: mockFreelancer.id,
                    project_id: mockProjectId,
                    message: 'I am interested in this project and would love to discuss further.',
                    // status is not in the FreelancerApplication type, so we're removing it
                    freelancer_profile: mockFreelancer
                  }}
                  projectId={mockProjectId}
                />
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Avatar Component</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <FreelancerAvatar profile={mockFreelancer} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Freelancer Profile Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuoteFreelancerProfileCard
                    freelancer={mockFreelancer}
                    quoteDate={mockQuoteDate}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Messages Freelancer Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <MessagesFreelancerProfile
                    freelancerName={mockFreelancer.display_name}
                    profilePhoto={mockFreelancer.profile_photo}
                    jobTitle={mockFreelancer.job_title}
                    isVerified={mockFreelancer.verified}
                    isLoadingFreelancer={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quotes Table Freelancer Info Cell</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerInfoCell
                    freelancer={mockFreelancer}
                    freelancerId={mockFreelancer.id}
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Freelancer Profile Header</CardTitle>
              </CardHeader>
              <CardContent>
                <FreelancerProfileHeader profile={mockFreelancer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileCardsTest;
