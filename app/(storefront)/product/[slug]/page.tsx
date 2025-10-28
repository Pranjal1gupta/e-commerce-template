import { dummyData } from '@/lib/dummy-data';
import { ProductDetailClient } from '@/components/products/product-detail-client';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getProduct(slug: string) {
  const product = await dummyData.getProductBySlug(slug);

  if (!product) return null;

  const reviews = await dummyData.getReviews(product.id);

  // Fetch category data
  const category = product.category_id ? await dummyData.getCategoryBySlug(
    (await dummyData.getCategories()).find(cat => cat.id === product.category_id)?.slug || ''
  ) : null;

  const relatedProducts = await dummyData.getProducts({
    category_id: product.category_id || undefined,
    limit: 4,
  }).then(products => products.filter(p => p.id !== product.id));

  return {
    product: {
      ...product,
      category,
    },
    reviews,
    relatedProducts,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) {
    notFound();
  }

  return <ProductDetailClient {...data} />;
}
