'use client';

import { ProductInfoSection } from './product-info-section';
import { VariantSelector } from './variant-selector';
import { AddToCartSection } from './add-to-cart-section';
import { OffersBanner } from './offers-banner';

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    base_price: number;
    discounted_price?: number;
    stock_quantity: number;
    rating: number;
    review_count: number;
    sku?: string;
    is_featured?: boolean;
    is_new_arrival?: boolean;
    variants?: any[];
  };
  category?: {
    name: string;
  };
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

export function ProductDetailClient({
  product,
  category,
  offers,
}: ProductDetailClientProps) {
  const handleAddToCart = (quantity: number) => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // TODO: Implement actual cart logic
  };

  const handleBuyNow = (quantity: number) => {
    console.log(`Buy now: ${quantity} of ${product.name}`);
    // TODO: Implement checkout flow
  };

  const handleAddToWishlist = () => {
    console.log(`Added ${product.name} to wishlist`);
    // TODO: Implement wishlist logic
  };

  const handleShare = () => {
    console.log(`Share ${product.name}`);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Product Info */}
      <ProductInfoSection
        title={product.name}
        brand={product.brand}
        category={category?.name}
        rating={product.rating}
        reviewCount={product.review_count}
        sku={product.sku}
        isBestSeller={product.is_featured}
        isNewArrival={product.is_new_arrival}
      />

      {/* Variants */}
      {product.variants && (product.variants as any[]).length > 0 && (
        <VariantSelector
          variants={product.variants}
          onVariantChange={() => {}}
          basePrice={product.base_price}
        />
      )}

      {/* Offers Banner */}
      {offers && offers.length > 0 && <OffersBanner offers={offers} />}

      {/* Add to Cart Section */}
      <AddToCartSection
        productId={product.id}
        productName={product.name}
        price={product.base_price}
        discountedPrice={product.discounted_price}
        inStock={product.stock_quantity > 0}
        stockQuantity={product.stock_quantity}
        codAvailable={true}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onAddToWishlist={handleAddToWishlist}
        onShare={handleShare}
      />
    </div>
  );
}