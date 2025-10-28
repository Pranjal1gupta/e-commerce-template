import { dummyData } from '@/lib/dummy-data';
import { ProductCard } from '@/components/products/product-card';
import { Zap } from 'lucide-react';

export const revalidate = 60;

async function getNewArrivals() {
  const products = await dummyData.getProducts({ is_new_arrival: true });
  return products;
}

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold">New Arrivals</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Check out our latest additions to the store
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No new arrivals at the moment</p>
        </div>
      )}
    </div>
  );
}
