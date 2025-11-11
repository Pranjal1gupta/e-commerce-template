interface StructuredDataProps {
  productName: string;
  productDescription: string;
  productImage: string;
  brand: string;
  price: number;
  currency?: string;
  availability: 'InStock' | 'OutOfStock' | 'LimitedAvailability';
  rating: number;
  reviewCount: number;
  sku?: string;
  url?: string;
  discountedPrice?: number;
}

export function StructuredData({
  productName,
  productDescription,
  productImage,
  brand,
  price,
  currency = 'USD',
  availability,
  rating,
  reviewCount,
  sku,
  url = '',
  discountedPrice,
}: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: productImage,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: currency,
      price: discountedPrice ? discountedPrice.toString() : price.toString(),
      availability: `https://schema.org/${availability}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount,
    },
    ...(sku && { sku }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}