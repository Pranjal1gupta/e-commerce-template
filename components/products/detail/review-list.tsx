'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { RatingStars } from './rating-stars';

export interface ReviewData {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  unhelpful: number;
  verified?: boolean;
  images?: string[];
}

interface ReviewListProps {
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
}

export function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filter, setFilter] = useState<'all' | number>('all');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredReviews = sortedReviews.filter((r) =>
    filter === 'all' ? true : r.rating === filter
  );

  const chartData = [
    { rating: 5, count: ratingDistribution.find((r) => r.rating === 5)?.count || 0 },
    { rating: 4, count: ratingDistribution.find((r) => r.rating === 4)?.count || 0 },
    { rating: 3, count: ratingDistribution.find((r) => r.rating === 3)?.count || 0 },
    { rating: 2, count: ratingDistribution.find((r) => r.rating === 2)?.count || 0 },
    { rating: 1, count: ratingDistribution.find((r) => r.rating === 1)?.count || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {averageRating.toFixed(1)}
              </p>
              <RatingStars rating={averageRating} size="lg" showLabel={false} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Based on {totalReviews.toLocaleString()} reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis type="number" hide />
                <YAxis dataKey="rating" type="category" hide />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'][index]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Filters and Sort */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Reviews
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filter === rating ? 'default' : 'outline'}
              onClick={() => setFilter(rating)}
              size="sm"
            >
              {rating} ⭐
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            onClick={() => setSortBy('recent')}
            size="sm"
          >
            Most Recent
          </Button>
          <Button
            variant={sortBy === 'helpful' ? 'default' : 'outline'}
            onClick={() => setSortBy('helpful')}
            size="sm"
          >
            Most Helpful
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            onClick={() => setSortBy('rating')}
            size="sm"
          >
            Highest Rating
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No reviews found for this filter.
          </p>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.author}
                    </h4>
                    {review.verified && (
                      <span className="text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <RatingStars rating={review.rating} size="sm" showLabel={false} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>

              {review.title && (
                <p className="font-semibold text-gray-900 dark:text-white">
                  {review.title}
                </p>
              )}

              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {review.comment}
              </p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Not helpful ({review.unhelpful})
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}