
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
  const { averageRating, reviewCount, usesMockReviews } = useClientReviews(userId);
  
  // Use the provided rating/count or the live data
  // But prioritize live data from the hook if it's available
  const displayRating = usesMockReviews && averageRating !== null 
    ? averageRating 
    : (rating !== undefined && rating !== null) 
      ? rating 
      : averageRating;
      
  const displayCount = reviewsCount !== undefined ? reviewsCount : reviewCount;
  
  // Add console log to debug rating data
  console.log('ProfileRatingStars data:', { 
    userId, 
    rating, 
    reviewsCount, 
    averageRating, 
    reviewCount, 
    displayRating, 
    displayCount, 
    showEmpty,
    usesMockReviews
  });
  
  // Use the common RatingStars component with appropriate size for profiles
  return <RatingStars rating={displayRating} reviewCount={displayCount} size="sm" showEmpty={showEmpty} />;
};

export default ProfileRatingStars;
