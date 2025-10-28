import { dummyData } from '@/lib/dummy-data';
import { ProductCard } from '@/components/products/product-card';
import { Tag } from 'lucide-react';

export const revalidate = 60;

async function getDeals() {
  const products = await dummyData.getProducts({ is_featured: true });
  return products;
}

export default async function DealsPage() {
  const products = await getDeals();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Special Deals & Offers</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Limited time offers on selected products. Grab them while they last!
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
          <p className="text-muted-foreground">No deals available at the moment</p>
        </div>
      )}
    </div>
  );
}
