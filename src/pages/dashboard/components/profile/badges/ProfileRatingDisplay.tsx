
import React from 'react';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';

interface ProfileRatingDisplayProps {
  userId: string;
  showEmpty?: boolean;
}

const ProfileRatingDisplay: React.FC<ProfileRatingDisplayProps> = ({
  userId,
  showEmpty = true
}) => {
  if (!userId) return null;
  
  return (
    <div className="ml-auto">
      <ProfileRatingStars userId={userId} showEmpty={showEmpty} />
    </div>
  );
};

export default ProfileRatingDisplay;
