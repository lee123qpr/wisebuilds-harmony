
import React from 'react';
import { Calendar, Briefcase, MapPin, PoundSterling, Star, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import VerificationBadge from '@/components/common/VerificationBadge';
import FreelancerAvatar from './FreelancerAvatar';

interface InsuranceStatus {
  hasInsurance: boolean;
  coverLevel?: string;
}

interface FreelancerProfileCardProps {
  profileImage: string | null;
  fullName: string;
  profession: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
  idVerified: boolean;
  rating?: number | null;
  reviewsCount?: number;
  location?: string | null;
  hourlyRate?: string | null;
  allowImageUpload?: boolean;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  insuranceStatus?: {
    hasInsurance: boolean;
    coverLevel?: string;
  };
  previousWork?: string[] | {
    name: string;
    url: string;
    type: string;
    size: number;
    path: string;
  }[];
  compact?: boolean;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted,
  idVerified,
  rating,
  reviewsCount,
  location,
  hourlyRate,
  allowImageUpload = false,
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  insuranceStatus,
  previousWork,
  compact = false
}) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format member since date if available
  const formattedMemberSince = memberSince ? 
    new Date(memberSince).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }) : null;

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border/40">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar with upload functionality */}
          <FreelancerAvatar
            profileImage={profileImage}
            fullName={fullName}
            userId={userId}
            size="md"
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setProfileImage={setProfileImage}
            allowImageUpload={allowImageUpload}
          />
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{fullName}</h3>
              {idVerified && (
                <VerificationBadge type="none" status="verified" showTooltip={false} className="h-4 w-4" />
              )}
            </div>
            
            <p className="text-muted-foreground mb-2">{profession}</p>
            
            {/* Rating stars - Make sure this is properly displayed */}
            {(rating !== undefined && rating !== null) && (
              <div className="mb-2">
                <ProfileRatingStars 
                  userId={userId}
                  rating={rating}
                  reviewsCount={reviewsCount}
                  showEmpty={true}
                />
              </div>
            )}
            
            {/* Verification badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {emailVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                  Email verified
                </Badge>
              )}
              
              {idVerified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  ID verified
                </Badge>
              )}
              
              <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                {jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed
              </Badge>
            </div>
            
            {/* Metadata */}
            <div className="space-y-1.5">
              {formattedMemberSince && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>Member since {formattedMemberSince}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="mr-1.5 h-4 w-4 flex-shrink-0" />
                <span>{jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed</span>
              </div>
              
              {/* Make sure location is properly displayed */}
              {location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{location}</span>
                </div>
              )}
              
              {hourlyRate && (
                <div className="flex items-center text-sm font-medium text-primary mt-2">
                  <PoundSterling className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{hourlyRate}/hr</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
