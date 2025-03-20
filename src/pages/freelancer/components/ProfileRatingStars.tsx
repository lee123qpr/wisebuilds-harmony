
import React from 'react';
import RatingStars from '@/components/common/RatingStars';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';

interface ProfileRatingStarsProps {
  userId: string;
  rating?: number | null;
  reviewsCount?: number;
  showEmpty?: boolean;
}

const ProfileRatingStars: React.FC<ProfileRatingStarsProps> = ({ 
  userId,
  rating, 
  reviewsCount,
  showEmpty = true
}) => {
  // If userId is provided, fetch live review data
  const { averageRating, reviewCount } = useClientReviews(userId);
  
  // Use the provided rating/count or the live data
  // But ensure null values from props don't override valid values from the hook
  const displayRating = (rating !== undefined && rating !== null) ? rating : averageRating;
  const displayCount = reviewsCount !== undefined ? reviewsCount : reviewCount;
  
  // Add console log to debug rating data
  console.log('ProfileRatingStars data:', { userId, rating, reviewsCount, averageRating, reviewCount, displayRating, displayCount, showEmpty });
  
  // Use the common RatingStars component with appropriate size for profiles
  return <RatingStars rating={displayRating} reviewCount={displayCount} size="sm" showEmpty={showEmpty} />;
};

export default ProfileRatingStars;
