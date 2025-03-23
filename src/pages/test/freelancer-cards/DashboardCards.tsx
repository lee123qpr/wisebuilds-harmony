
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardFreelancerProfileCard from '@/pages/dashboard/components/profile/FreelancerProfileCard';

interface DashboardCardsProps {
  completeFreelancer: any;
  minimalFreelancer: any;
  expertFreelancer: any;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  completeFreelancer,
  minimalFreelancer,
  expertFreelancer,
  uploadingImage,
  setUploadingImage
}) => {
  return (
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
  );
};

export default DashboardCards;
