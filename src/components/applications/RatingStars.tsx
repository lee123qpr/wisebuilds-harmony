
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  reviewsCount?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviewsCount = 0 }) => {
  if (!rating) return null;
  
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        <Star className="h-4 w-4 text-gray-300" />
        <div className="absolute inset-0 overflow-hidden w-1/2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </div>
      </div>
    );
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
    );
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({reviewsCount})</span>
    </div>
  );
};

export default RatingStars;
