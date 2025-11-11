'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from './rating-stars';

interface ProductInfoSectionProps {
  title: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  sku?: string;
  modelNumber?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedEdition?: boolean;
}

export function ProductInfoSection({
  title,
  brand,
  category,
  subcategory,
  rating,
  reviewCount,
  sku,
  modelNumber,
  isBestSeller = false,
  isNewArrival = false,
  isLimitedEdition = false,
}: ProductInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Badges */}
      {(isBestSeller || isNewArrival || isLimitedEdition) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {isBestSeller && (
            <Badge className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900">
              🔥 Best Seller
            </Badge>
          )}
          {isNewArrival && (
            <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900">
              ✨ New Arrival
            </Badge>
          )}
          {isLimitedEdition && (
            <Badge className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900">
              ⭐ Limited Edition
            </Badge>
          )}
        </motion.div>
      )}

      {/* Brand */}
      {brand && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Brand: <span className="font-semibold text-gray-900 dark:text-white">{brand}</span>
        </motion.p>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight"
      >
        {title}
      </motion.h1>

      {/* Category Path */}
      {(category || subcategory) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Category: {category && <span>{category}</span>}
          {subcategory && <span> &gt; {subcategory}</span>}
        </motion.p>
      )}

      {/* Rating and Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4 py-3 border-y"
      >
        <RatingStars
          rating={rating}
          reviewCount={reviewCount}
          size="md"
        />
      </motion.div>

      {/* Product Details */}
      {(sku || modelNumber) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg"
        >
          {sku && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">SKU</p>
              <p className="font-mono font-semibold text-gray-900 dark:text-white">{sku}</p>
            </div>
          )}
          {modelNumber && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Model Number</p>
              <p className="font-mono font-semibold text-gray-900 dark:text-white">{modelNumber}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}