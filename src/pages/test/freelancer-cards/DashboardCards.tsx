
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardFreelancerProfileCard from '@/pages/dashboard/components/profile/FreelancerProfileCard';
import FreelancerProfileCard from '@/components/freelancer/FreelancerProfileCard';

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
          <CardTitle>Dashboard Freelancer Profile Card (Original)</CardTitle>
          <CardDescription>Using wrapper component</CardDescription>
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
            rating={completeFreelancer.rating}
            reviewsCount={completeFreelancer.reviews_count}
            hourlyRate={completeFreelancer.hourly_rate}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Standardized Freelancer Profile Card - Regular</CardTitle>
          <CardDescription>Using the base component directly</CardDescription>
        </CardHeader>
        <CardContent>
          <FreelancerProfileCard
            profileImage={completeFreelancer.profile_photo}
            fullName={completeFreelancer.display_name}
            profession={completeFreelancer.job_title}
            userId={completeFreelancer.id}
            memberSince={completeFreelancer.member_since}
            emailVerified={completeFreelancer.email_verified}
            jobsCompleted={completeFreelancer.jobs_completed}
            idVerified={completeFreelancer.verified}
            rating={completeFreelancer.rating}
            reviewsCount={completeFreelancer.reviews_count}
            hourlyRate={completeFreelancer.hourly_rate}
            allowImageUpload={false}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Standardized Freelancer Profile Card - Compact</CardTitle>
          <CardDescription>Compact version with minimal info</CardDescription>
        </CardHeader>
        <CardContent>
          <FreelancerProfileCard
            profileImage={minimalFreelancer.profile_photo}
            fullName={minimalFreelancer.display_name}
            profession={minimalFreelancer.job_title}
            userId={minimalFreelancer.id}
            compact={true}
            rating={minimalFreelancer.rating}
            reviewsCount={minimalFreelancer.reviews_count}
            hourlyRate={minimalFreelancer.hourly_rate}
            allowImageUpload={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
