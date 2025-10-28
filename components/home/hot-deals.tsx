'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { dummyData } from '@/lib/dummy-data';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight, Zap } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export function HotDeals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const autoplayPlugin = Autoplay({
    delay: 2500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  useEffect(() => {
    fetchHotDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function fetchHotDeals() {
    const data = await dummyData.getProducts({ is_featured: true, limit: 8 });
    setProducts(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="h-6 w-6 text-orange-600 animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Hot Deals
          </h2>
        </div>
        <div className="relative px-12">
          <Carousel>
            <CarouselContent>
              {[...Array(8)].map((_, i) => (
                <CarouselItem key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Skeleton className="h-[250px]" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-2">
      <div className=" rounded-2xl p-8 mb-2">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-full shadow-lg">
              <Flame className="h-7 w-7 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Flash Hot Deals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Limited time offers on best-selling products
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">Ends in:</span>
            <span className="font-mono font-bold text-lg">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative px-4 sm:px-6 md:px-12 lg:px-20">
        <Carousel
          opts={{ 
            slidesToScroll: 1, 
            loop: true,
            align: 'start',
            dragFree: false,
          }}
          plugins={[autoplayPlugin]}
        >
          <CarouselContent className="">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-2/5 lg:basis-1/4">
                <div className="relative group">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl" />
          <CarouselNext className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl" />
        </Carousel>
      </div>

      <div className="flex justify-center mt-10">
        <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
          <Link href="/deals" className="flex items-center">
            View All Hot Deals
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
