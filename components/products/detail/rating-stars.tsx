'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function RatingStars({
  rating,
  reviewCount,
  size = 'md',
  showLabel = true,
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const sizes = {
    sm: { star: 'w-4 h-4', text: 'text-sm' },
    md: { star: 'w-5 h-5', text: 'text-base' },
    lg: { star: 'w-6 h-6', text: 'text-lg' },
  };

  const handleRate = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            <button
              onClick={() => handleRate(star)}
              disabled={!interactive}
              className={`${sizes[size].star} transition-all ${
                interactive ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <Star
                className={`w-full h-full ${
                  star <= Math.round(rating)
                    ? 'fill-yellow-400 stroke-yellow-500'
                    : 'stroke-gray-300'
                } ${
                  star <= rating && star > Math.floor(rating)
                    ? 'fill-yellow-300'
                    : ''
                }`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      {showLabel && (
        <div className={`flex items-baseline gap-2 ${sizes[size].text}`}>
          <span className="font-semibold text-gray-900 dark:text-white">
            {rating.toFixed(1)}
          </span>
          {reviewCount !== undefined && (
            <span className="text-gray-600 dark:text-gray-400">
              ({reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </div>
      )}
    </div>
  );
}