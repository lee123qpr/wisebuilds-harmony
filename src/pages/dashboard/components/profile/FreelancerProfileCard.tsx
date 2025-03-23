
import React from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
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
}

const DashboardFreelancerProfileCard: React.FC<DashboardFreelancerProfileCardProps> = (props) => {
  return (
    <Card className="border shadow-md overflow-hidden bg-gradient-to-br from-white to-slate-50">
      <CardContent className="pt-6">
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
          allowImageUpload={true}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardFreelancerProfileCard;
