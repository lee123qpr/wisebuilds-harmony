
import React from 'react';
import RatingStars from '@/components/common/RatingStars';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';

interface ProfileRatingStarsProps {
  userId: string;
  rating?: number;
  reviewsCount?: number;
}

const ProfileRatingStars: React.FC<ProfileRatingStarsProps> = ({ 
  userId,
  rating, 
  reviewsCount
}) => {
  // If userId is provided, fetch live review data
  const { averageRating, reviewCount } = useClientReviews(userId);
  
  // Use the provided rating/count or the live data
  const displayRating = rating !== undefined ? rating : averageRating;
  const displayCount = reviewsCount !== undefined ? reviewsCount : reviewCount;
  
  // Use the common RatingStars component with appropriate size for profiles
  return <RatingStars rating={displayRating} reviewCount={displayCount} size="sm" showEmpty={true} />;
};

export default ProfileRatingStars;
