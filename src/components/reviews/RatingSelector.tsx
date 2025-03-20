
import React from 'react';
import { Star } from 'lucide-react';

interface RatingSelectorProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ value, onChange, max = 5 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            className="p-1 hover:scale-110 transition-transform"
            aria-label={`Rate ${starValue} out of ${max}`}
          >
            <Star
              className={`h-6 w-6 ${
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {value} out of {max}
      </span>
    </div>
  );
};

export default RatingSelector;
