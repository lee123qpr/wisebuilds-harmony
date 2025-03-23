
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
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
  
  // Complete profile with all data
  const completeFreelancer = {
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
  
  // Minimal profile with only required fields
  const minimalFreelancer = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    display_name: 'Jane Smith',
    first_name: 'Jane',
    last_name: 'Smith',
    profile_photo: null,
    job_title: '',
    email_verified: false,
    verified: false,
    rating: null,
    reviews_count: 0,
    skills: [],
    location: '',
    member_since: null,
    jobs_completed: 0,
    bio: '',
    email: 'jane.smith@example.com',
    phone_number: ''
  };
  
  // New freelancer with some data
  const newFreelancer = {
    id: '323e4567-e89b-12d3-a456-426614174002',
    display_name: 'Robert Johnson',
    first_name: 'Robert',
    last_name: 'Johnson',
    profile_photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Electrical Engineer',
    email_verified: true,
    verified: false,
    rating: 0,
    reviews_count: 0,
    skills: ['Electrical', 'Wiring', 'Lighting'],
    location: 'Manchester, UK',
    member_since: '2023-12-01',
    jobs_completed: 0,
    bio: 'Recently qualified electrical engineer looking for projects.',
    email: 'robert.johnson@example.com',
    phone_number: '+44 7700 900456'
  };
  
  // Highly rated freelancer
  const expertFreelancer = {
    id: '423e4567-e89b-12d3-a456-426614174003',
    display_name: 'Sarah Williams',
    first_name: 'Sarah',
    last_name: 'Williams',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    job_title: 'Senior Interior Designer',
    email_verified: true,
    verified: true,
    rating: 5.0,
    reviews_count: 48,
    skills: ['Interior Design', 'Space Planning', 'Color Theory', 'Furniture Selection', 'Concept Development'],
    location: 'Edinburgh, UK',
    member_since: '2020-03-10',
    jobs_completed: 53,
    bio: 'Award-winning interior designer with over 15 years of experience working with residential and commercial clients.',
    email: 'sarah.williams@example.com',
    phone_number: '+44 7700 900789'
  };

  const mockQuoteDate = new Date().toISOString();
  const mockProjectId = 'project-123';

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
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Freelancer Profile Card - Complete Profile</CardTitle>
                  <CardDescription>Experienced freelancer with full profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardFreelancerProfileCard
                    profileImage={completeFreelancer.profile_photo}
                    uploadingImage={uploadingImage}
                    setUploadingImage={setUploadingImage}
                    setProfileImage={() => {}}
                    fullName={completeFreelancer.display_name}
                    profession={completeFreelancer.job_title}
                    userId={completeFreelancer.id}
                    memberSince={completeFreelancer.member_since}
                    emailVerified={completeFreelancer.email_verified}
                    jobsCompleted={completeFreelancer.jobs_completed}
                    idVerified={completeFreelancer.verified}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Freelancer Profile Card - New User</CardTitle>
                  <CardDescription>New freelancer with minimal profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardFreelancerProfileCard
                    profileImage={minimalFreelancer.profile_photo}
                    uploadingImage={false}
                    setUploadingImage={setUploadingImage}
                    setProfileImage={() => {}}
                    fullName={minimalFreelancer.display_name}
                    profession={minimalFreelancer.job_title || 'Freelancer'}
                    userId={minimalFreelancer.id}
                    memberSince={minimalFreelancer.member_since}
                    emailVerified={minimalFreelancer.email_verified}
                    jobsCompleted={minimalFreelancer.jobs_completed}
                    idVerified={minimalFreelancer.verified}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Freelancer Profile Card - Uploading State</CardTitle>
                  <CardDescription>Shows how the card looks when an image is being uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardFreelancerProfileCard
                    profileImage={expertFreelancer.profile_photo}
                    uploadingImage={true}
                    setUploadingImage={setUploadingImage}
                    setProfileImage={() => {}}
                    fullName={expertFreelancer.display_name}
                    profession={expertFreelancer.job_title}
                    userId={expertFreelancer.id}
                    memberSince={expertFreelancer.member_since}
                    emailVerified={expertFreelancer.email_verified}
                    jobsCompleted={expertFreelancer.jobs_completed}
                    idVerified={expertFreelancer.verified}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Application Card - Complete Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationFreelancerCard
                    application={{
                      id: 'app-123',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      user_id: completeFreelancer.id,
                      project_id: mockProjectId,
                      message: 'I am interested in this project and would love to discuss further. I have extensive experience in this type of work and can start immediately.',
                      freelancer_profile: completeFreelancer
                    }}
                    projectId={mockProjectId}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Application Card - Minimal Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationFreelancerCard
                    application={{
                      id: 'app-124',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      user_id: minimalFreelancer.id,
                      project_id: mockProjectId,
                      message: 'I would like to apply for this project.',
                      freelancer_profile: minimalFreelancer
                    }}
                    projectId={mockProjectId}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Avatar Component - Various States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-10 justify-around">
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2 font-medium">With Profile Photo</h3>
                      <FreelancerAvatar profile={completeFreelancer} />
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2 font-medium">Without Profile Photo</h3>
                      <FreelancerAvatar profile={minimalFreelancer} />
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2 font-medium">Verified User</h3>
                      <FreelancerAvatar profile={expertFreelancer} />
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="mb-2 font-medium">Email Verified Only</h3>
                      <FreelancerAvatar profile={newFreelancer} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Freelancer Profile Card - Various Users</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Experienced Freelancer</h3>
                    <QuoteFreelancerProfileCard
                      freelancer={completeFreelancer}
                      quoteDate={mockQuoteDate}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">New Freelancer</h3>
                    <QuoteFreelancerProfileCard
                      freelancer={newFreelancer}
                      quoteDate={mockQuoteDate}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Minimal Profile</h3>
                    <QuoteFreelancerProfileCard
                      freelancer={minimalFreelancer}
                      quoteDate={mockQuoteDate}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Expert Freelancer</h3>
                    <QuoteFreelancerProfileCard
                      freelancer={expertFreelancer}
                      quoteDate={mockQuoteDate}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Messages Freelancer Profile - Various States</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Complete Profile</h3>
                    <MessagesFreelancerProfile
                      freelancerName={completeFreelancer.display_name}
                      profilePhoto={completeFreelancer.profile_photo}
                      jobTitle={completeFreelancer.job_title}
                      isVerified={completeFreelancer.verified}
                      isLoadingFreelancer={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">No Profile Photo</h3>
                    <MessagesFreelancerProfile
                      freelancerName={minimalFreelancer.display_name}
                      profilePhoto={minimalFreelancer.profile_photo}
                      jobTitle={minimalFreelancer.job_title || 'Freelancer'}
                      isVerified={minimalFreelancer.verified}
                      isLoadingFreelancer={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Not Verified</h3>
                    <MessagesFreelancerProfile
                      freelancerName={newFreelancer.display_name}
                      profilePhoto={newFreelancer.profile_photo}
                      jobTitle={newFreelancer.job_title}
                      isVerified={newFreelancer.verified}
                      isLoadingFreelancer={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Loading State</h3>
                    <MessagesFreelancerProfile
                      freelancerName="Loading..."
                      profilePhoto={undefined}
                      jobTitle="Loading..."
                      isVerified={false}
                      isLoadingFreelancer={true}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quotes Table Freelancer Info Cell</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Complete Profile</h3>
                    <FreelancerInfoCell
                      freelancer={completeFreelancer}
                      freelancerId={completeFreelancer.id}
                      isLoading={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">New User</h3>
                    <FreelancerInfoCell
                      freelancer={newFreelancer}
                      freelancerId={newFreelancer.id}
                      isLoading={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Minimal Information</h3>
                    <FreelancerInfoCell
                      freelancer={minimalFreelancer}
                      freelancerId={minimalFreelancer.id}
                      isLoading={false}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Loading State</h3>
                    <FreelancerInfoCell
                      freelancer={{}}
                      freelancerId="loading"
                      isLoading={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Profile Header - Complete Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerProfileHeader profile={completeFreelancer} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Profile Header - Minimal Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerProfileHeader profile={minimalFreelancer} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Profile Header - Expert Freelancer</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerProfileHeader profile={expertFreelancer} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Freelancer Profile Header - New Freelancer</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerProfileHeader profile={newFreelancer} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileCardsTest;
