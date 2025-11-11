'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RatingStars } from './rating-stars';

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
}

interface RelatedProductsCarouselProps {
  products: RelatedProduct[];
  title?: string;
}

export function RelatedProductsCarousel({
  products,
  title = 'Similar Products',
}: RelatedProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <motion.div
            initial={false}
            animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
              >
                <Link href={`/product/${product.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {product.badge && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <RatingStars
                          rating={product.rating}
                          size="sm"
                          showLabel={false}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          ${product.discountedPrice ?? product.price}
                        </span>
                        {product.discountedPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle add to cart
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        {products.length > itemsPerView && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
              onClick={goToNext}
              disabled={currentIndex === maxIndex}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Carousel Dots */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map(
            (_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === Math.floor(currentIndex / itemsPerView)
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}