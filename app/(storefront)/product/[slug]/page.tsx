import { dummyData } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BreadcrumbNav } from '@/components/products/detail/breadcrumb-nav';
import { ImageGallery } from '@/components/products/detail/image-gallery';
import { ProductDetailClient } from '@/components/products/detail/product-detail-client';
import { HighlightsSection } from '@/components/products/detail/highlights-section';
import { ReviewList } from '@/components/products/detail/review-list';
import { QASection } from '@/components/products/detail/qa-section';
import { RelatedProductsCarousel } from '@/components/products/detail/related-products-carousel';
import { StructuredData } from '@/components/products/detail/structured-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await dummyData.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const description =
    product.meta_description || product.description?.substring(0, 160);

  return {
    title: product.meta_title || product.name,
    description,
    keywords: product.meta_keywords || product.tags?.join(', '),
    openGraph: {
      title: product.name,
      description: description || '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
  };
}

interface ProductDetailsData {
  id: string;
  highlights?: string[];
  specifications?: Record<string, string>;
  warranty?: string;
  careInfo?: string;
  qaItems?: Array<{
    id: string;
    question: string;
    answer: string;
    questionBy: string;
    answeredBy?: string;
    helpful: number;
    date: string;
  }>;
  relatedProducts?: Array<{
    id: string;
    name: string;
    slug: string;
    images: string[];
    base_price: number;
    discounted_price?: number;
    rating: number;
    review_count: number;
  }>;
  offers?: Array<{
    id: string;
    title: string;
    description: string;
    code?: string;
    discount?: string;
    type: 'percentage' | 'fixed' | 'bogo' | 'emi';
    badge?: string;
  }>;
}

async function getProductDetails(slug: string) {
  const product = await dummyData.getProductBySlug(slug);

  if (!product) return null;

  // Get reviews
  const reviews = await dummyData.getReviews(product.id);

  // Get category
  const categories = await dummyData.getCategories();
  const category = product.category_id
    ? categories.find((cat) => cat.id === product.category_id)
    : null;

  // Get related products (same category, excluding current)
  const allProducts = await dummyData.getProducts({
    category_id: product.category_id || undefined,
    limit: 8,
  });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 6);

  // Get offers
  const offers = await dummyData.getOffers();
  const productOffers = offers.filter((o) => o.is_active).slice(0, 3);

  // Calculate rating distribution
  const approvedReviews = reviews.filter((r) => r.status === 'Approved');
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: approvedReviews.filter((r) => r.rating === rating).length,
  }));

  // Mock detailed product data
  const productDetails: ProductDetailsData = {
    id: product.id,
    highlights:
      product.highlights || [
        '🔋 Long battery life - 48 hours',
        '📱 Ergonomic design for comfort',
        '🔐 Secure and private',
        '⚡ Fast charging technology',
        '♻️ Eco-friendly materials',
        '🎯 High precision sensors',
      ],
    specifications: product.specifications || {
      'Dimensions': '15 x 10 x 2 cm',
      'Weight': '250 grams',
      'Material': 'Premium Aluminum',
      'Color Options': 'Black, Silver, Gold',
      'Warranty': '12 Months',
      'Certification': 'CE, FCC, RoHS',
    },
    warranty: '12 Months Manufacturer Warranty',
    careInfo: 'Keep away from moisture. Clean with soft cloth only.',
    qaItems: [
      {
        id: 'qa_1',
        question: 'Is this compatible with iPhone 13?',
        answer: 'Yes, this product is fully compatible with all iPhone models from iPhone 12 onwards.',
        questionBy: 'John D.',
        answeredBy: 'Support Team',
        helpful: 45,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'qa_2',
        question: 'What is the return policy?',
        answer: 'We offer 30 days full refund guarantee if you are not satisfied with the product.',
        questionBy: 'Sarah M.',
        answeredBy: 'Support Team',
        helpful: 32,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    relatedProducts: relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      images: p.images,
      base_price: p.base_price,
      discounted_price: p.discounted_price,
      rating: p.rating,
      review_count: p.review_count,
    })),
    offers: productOffers.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      code: o.code,
      type: (o.discount_type || 'percentage') as 'percentage' | 'fixed' | 'bogo' | 'emi',
      badge: o.discount_type === 'percentage' ? `${o.discount_value}% OFF` : `$${o.discount_value} OFF`,
    })),
  };

  return {
    product,
    reviews: approvedReviews,
    ratingDistribution,
    category,
    ...productDetails,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductDetails(slug);

  if (!data) {
    notFound();
  }

  const {
    product,
    reviews,
    ratingDistribution,
    category,
    highlights,
    specifications,
    warranty,
    careInfo,
    qaItems,
    relatedProducts,
    offers,
  } = data;

  const breadcrumbItems = [
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: product.name, isActive: true },
  ];

  const discountPercentage = product.discounted_price
    ? Math.round(
        ((product.base_price - product.discounted_price) / product.base_price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Structured Data */}
      <StructuredData
        productName={product.name}
        productDescription={product.description}
        productImage={product.images?.[0] || ''}
        brand={product.brand || 'Unknown'}
        price={product.base_price}
        discountedPrice={product.discounted_price}
        availability={
          product.stock_quantity > 0 ? 'InStock' : 'OutOfStock'
        }
        rating={product.rating}
        reviewCount={product.review_count}
        sku={product.sku}
        url={`/product/${slug}`}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav items={breadcrumbItems} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-1">
            <ImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Middle/Right Column - Product Details (Client Component) */}
          <ProductDetailClient
            product={product}
            category={category || undefined}
            offers={offers}
          />
        </div>

        {/* Highlights Section */}
        {highlights && highlights.length > 0 && (
          <section className="mb-12">
            <HighlightsSection highlights={highlights} />
          </section>
        )}

        {/* Tabs Section - Description, Specifications, Warranty */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="warranty">Warranty & Care</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                {specifications &&
                  Object.entries(specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white dark:bg-gray-800 p-3 rounded border"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {key}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="warranty" className="space-y-4 mt-4">
              {warranty && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Warranty
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{warranty}</p>
                </div>
              )}
              {careInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Care Instructions
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{careInfo}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Reviews Section */}
        <section className="mb-12">
          <ReviewList
            reviews={reviews.map((r) => ({
              id: r.id,
              author: r.user?.full_name || 'Anonymous',
              rating: r.rating,
              title: '',
              comment: r.comment,
              date: r.created_at,
              helpful: 0,
              unhelpful: 0,
              verified: true,
            }))}
            averageRating={product.rating}
            totalReviews={product.review_count}
            ratingDistribution={ratingDistribution}
          />
        </section>

        {/* Q&A Section */}
        {qaItems && qaItems.length > 0 && (
          <section className="mb-12">
            <QASection items={qaItems} />
          </section>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mb-12">
            <RelatedProductsCarousel
              products={relatedProducts.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                image: p.images?.[0] || '',
                price: p.base_price,
                discountedPrice: p.discounted_price,
                rating: p.rating,
                reviewCount: p.review_count,
                badge: discountPercentage > 0 ? `${discountPercentage}% OFF` : undefined,
              }))}
              title="Similar Products"
            />
          </section>
        )}
      </main>
    </div>
  );
}
