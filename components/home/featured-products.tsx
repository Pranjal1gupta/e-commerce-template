import Link from 'next/link';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

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

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-400 rounded-full shadow-lg">
              <Sparkles className="h-7 w-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Curated selections of premium quality items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {products.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30">
          <Link href="/search" className="flex items-center">
            Explore All Featured Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
