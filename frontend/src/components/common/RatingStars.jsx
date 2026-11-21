import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 4.5, count = null, size = 'sm', showNumeric = true }) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className="flex items-center gap-1.5 text-amber-500">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showNumeric && (
        <span className="text-xs font-medium text-stone-700">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-stone-400">
          ({count} reviews)
        </span>
      )}
    </div>
  );
};
