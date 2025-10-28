import { dummyData } from '@/lib/dummy-data';
import { HeroSection } from '@/components/home/hero-section';
import { TrustIndicators } from '@/components/home/trust-indicators';
import BankDiscounts from '@/components/home/bank-discounts';
import { CategoryGrid } from '@/components/home/category-grid';
import { HotDeals } from '@/components/home/hot-deals';
import { FeaturedProducts } from '@/components/home/featured-products';
import { NewArrivals } from '@/components/home/new-arrivals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';


export const revalidate = 60;

async function getData() {
  const [categories, featuredProducts, newArrivals, offers] = await Promise.all([
    dummyData.getCategories(15),
    dummyData.getProducts({ is_featured: true, limit: 8 }),
    dummyData.getProducts({ is_new_arrival: true, limit: 4 }),
    dummyData.getOffers('banner'),
  ]);

  return {
    categories,
    featuredProducts,
    newArrivals,
    offers,
  };
}

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹500',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% safe transactions',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day return policy',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
    color: 'from-purple-500 to-purple-600',
  },
];

export default async function HomePage() {
  const data = await getData();

  return (
    <div className="min-h-screen">
      <HeroSection offers={data.offers} />
      <TrustIndicators />
      <BankDiscounts />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Hot Deals Section */}
        <div className="mb-20">
          <HotDeals />
        </div>

        {/* Features Section */}
        <section className="my-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Decorative Separator */}
        <div className="flex items-center justify-center gap-4 my-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
          <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">✨</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
        </div>

        {/* Category Grid Section */}
        <section className="">
          <div className="mb-8">
            <div className="inline-block">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
                🏪 Explore Categories
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Browse our diverse selection of products organized by category
            </p>
          </div>
          <CategoryGrid categories={data.categories} />
        </section>

        {/* Featured Products Section */}
        <section className="my-20">
          <FeaturedProducts products={data.featuredProducts} />
        </section>

        {/* Promotional Banner */}
        <section className="my-20">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 rounded-2xl overflow-hidden">
            <div className="relative px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-semibold mb-4">
                  Special Offer
                </span>
                <h3 className="text-4xl font-bold text-white mb-4">
                  Get Exclusive Deals
                </h3>
                <p className="text-indigo-100 mb-6 max-w-md">
                  Subscribe to our newsletter and get 15% off on your first purchase plus exclusive access to new collections.
                </p>
                <Button asChild className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                  <Link href="/deals">Explore Deals</Link>
                </Button>
              </div>
              <div className="flex-1 relative h-64 hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg backdrop-blur-sm flex items-center justify-center">
                  <div className="text-6xl">🎁</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="my-20">
          <NewArrivals products={data.newArrivals} />
        </section>

        {/* Newsletter Section */}
        <section className="my-20 py-16 px-8 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Never Miss a Deal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Subscribe to our newsletter to get the latest updates on new products and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
