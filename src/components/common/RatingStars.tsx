
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number | null | undefined;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  reviewCount = 0,
  size = 'md',
  showEmpty = false,
  className
}) => {
  // Convert rating to a number for calculations
  const numericRating = rating !== null && rating !== undefined ? Number(rating) : 0;
  
  // Return null if rating is falsy and showEmpty is false
  if (!numericRating && !showEmpty) return null;

  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    // Render filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className={`${starSizes[size]} fill-yellow-400 text-yellow-400`} 
        />
      );
    }

    // Render half star if needed
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

    // Render empty stars
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
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {renderStars()}
      </div>
      {numericRating > 0 && (
        <span className={`${textSizes[size]} font-medium ml-1.5`}>
          {numericRating.toFixed(1)}
        </span>
      )}
      {reviewCount > 0 && (
        <span className={`${textSizes[size]} text-muted-foreground ml-0.5`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
