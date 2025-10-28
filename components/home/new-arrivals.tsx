import Link from 'next/link';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Star } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  actual_MRP?: number;
  discounted_price?: number;
  percentage_discount?: number;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  is_hot_deal?: boolean;
  has_offer?: boolean;
  is_new_arrival?: boolean;
  is_featured?: boolean;
};

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
              <Star className="h-7 w-7 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Latest Arrivals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover the newest additions to our collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-md">
            <Zap className="h-5 w-5 text-green-500" />
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Just Added</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 transform -rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              NEW
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
          <Link href="/new-arrivals" className="flex items-center">
            Shop All New Arrivals
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
