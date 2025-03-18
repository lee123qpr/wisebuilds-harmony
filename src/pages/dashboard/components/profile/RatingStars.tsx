
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number | null;
  reviewCount: number;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  reviewCount,
  size = 'md'
}) => {
  // Return null if rating is null, undefined, or NaN
  if (rating === null || rating === undefined || isNaN(Number(rating))) {
    return null;
  }

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl'
  };

  const renderStars = () => {
    const numericRating = Number(rating);
    const stars = [];
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className={`${starSizes[size]} fill-yellow-400 text-yellow-400`} 
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${starSizes[size]} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${starSizes[size]} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          className={`${starSizes[size]} text-gray-300`} 
        />
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {renderStars()}
      </div>
      <span className={`${textSizes[size]} font-medium ml-2`}>
        {Number(rating).toFixed(1)}
      </span>
      <span className={`${textSizes[size]} text-muted-foreground ml-1`}>
        ({reviewCount})
      </span>
    </div>
  );
};

export default RatingStars;
