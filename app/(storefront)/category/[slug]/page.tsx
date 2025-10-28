import { dummyData } from '@/lib/dummy-data';
import { CategoryPageClient } from '@/components/category/category-page-client';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getCategoryData(slug: string) {
  const category = await dummyData.getCategoryBySlug(slug);

  if (!category) return null;

  const products = await dummyData.getProducts({ category_id: category.id });

  return {
    category,
    products,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) {
    notFound();
  }

  return <CategoryPageClient {...data} />;
}
