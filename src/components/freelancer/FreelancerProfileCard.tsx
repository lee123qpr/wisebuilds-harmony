
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Check } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import { supabase } from '@/integrations/supabase/client';
import FreelancerMetadata from '@/components/freelancer/FreelancerMetadata';
import FreelancerProfileAvatar from './FreelancerProfileAvatar';

interface FreelancerProfileCardProps {
  profileImage: string | null;
  uploadingImage?: boolean;
  setUploadingImage?: (uploading: boolean) => void;
  setProfileImage?: (url: string | null) => void;
  fullName: string;
  profession: string | null;
  userId: string;
  memberSince?: string | null;
  emailVerified?: boolean;
  jobsCompleted?: number;
  idVerified?: boolean;
  rating?: number | null;
  reviewsCount?: number;
  location?: string | null;
  allowImageUpload?: boolean;
  compact?: boolean;
}

const FreelancerProfileCard: React.FC<FreelancerProfileCardProps> = ({
  profileImage,
  uploadingImage = false,
  setUploadingImage,
  setProfileImage,
  fullName,
  profession,
  userId,
  memberSince,
  emailVerified = false,
  jobsCompleted = 0,
  idVerified = false,
  rating,
  reviewsCount,
  location,
  allowImageUpload = false,
  compact = false
}) => {
  return (
    <div className={`border shadow-md rounded-lg ${compact ? 'p-4' : 'p-6'} bg-gradient-to-br from-white to-gray-50`}>
      <div className={`flex ${compact ? 'flex-row gap-3' : 'flex-col md:flex-row gap-6'} items-center md:items-start`}>
        <div className="relative">
          <FreelancerProfileAvatar
            profileImage={profileImage}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            setProfileImage={setProfileImage}
            fullName={fullName}
            userId={userId}
            size={compact ? 'sm' : 'lg'}
            editable={allowImageUpload}
          />
        </div>
        
        <div className={`flex-1 ${compact ? '' : 'text-center md:text-left'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>{fullName}</h2>
            {idVerified && <VerificationBadge type="id" status="verified" />}
          </div>
          
          {profession && (
            <p className="text-muted-foreground font-medium">{profession}</p>
          )}
          
          {/* Rating stars component */}
          <div className={`${compact ? 'mt-1' : 'mt-2'} flex justify-center md:justify-start`}>
            <ProfileRatingStars 
              userId={userId} 
              rating={rating} 
              reviewsCount={reviewsCount} 
              showEmpty={true} 
            />
          </div>
          
          {/* Show freelancer metadata */}
          {!compact && (
            <div className="mt-4">
              <FreelancerMetadata 
                profile={{
                  id: userId,
                  member_since: memberSince,
                  jobs_completed: jobsCompleted,
                  location: location
                }} 
                compact={false}
              />
            </div>
          )}
          
          {/* Only show badges in full mode */}
          {!compact && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {memberSince && (
                <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                  <Calendar className="h-3 w-3" />
                  Member since {format(new Date(memberSince), 'MMM yyyy')}
                </Badge>
              )}
              
              {emailVerified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Email verified
                </Badge>
              )}
              
              <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileCard;
