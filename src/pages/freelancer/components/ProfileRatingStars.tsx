
import React from 'react';
import RatingStars from '@/components/common/RatingStars';

interface ProfileRatingStarsProps {
  rating?: number;
  reviewsCount?: number;
}

const ProfileRatingStars: React.FC<ProfileRatingStarsProps> = ({ 
  rating, 
  reviewsCount = 0 
}) => {
  // Use the common RatingStars component with appropriate size for profiles
  return <RatingStars rating={rating} reviewCount={reviewsCount} size="sm" />;
};

export default ProfileRatingStars;
