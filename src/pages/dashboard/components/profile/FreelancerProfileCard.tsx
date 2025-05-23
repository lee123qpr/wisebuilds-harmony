
import React from 'react';
import FreelancerProfileCard from '@/components/freelancer/FreelancerProfileCard';

interface DashboardFreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
  setProfileImage: (url: string | null) => void;
  fullName: string;
  profession: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
  idVerified: boolean;
  rating?: number | null;
  reviewsCount?: number;
  hourlyRate?: string | null;
}

const DashboardFreelancerProfileCard: React.FC<DashboardFreelancerProfileCardProps> = (props) => {
  return (
    <FreelancerProfileCard
      profileImage={props.profileImage}
      uploadingImage={props.uploadingImage}
      setUploadingImage={props.setUploadingImage}
      setProfileImage={props.setProfileImage}
      fullName={props.fullName}
      profession={props.profession}
      userId={props.userId}
      memberSince={props.memberSince}
      emailVerified={props.emailVerified}
      jobsCompleted={props.jobsCompleted}
      idVerified={props.idVerified}
      rating={props.rating}
      reviewsCount={props.reviewsCount}
      hourlyRate={props.hourlyRate}
      allowImageUpload={true}
    />
  );
};

export default DashboardFreelancerProfileCard;
