# 🧩 Component Usage Guide

## Complete Reference for All Product Detail Components

### 📚 Table of Contents
1. [ImageGallery](#imagegallery)
2. [ProductInfoSection](#productinfosection)
3. [VariantSelector](#variantselector)
4. [RatingStars](#ratingstars)
5. [AddToCartSection](#addtocartsection)
6. [OffersBanner](#offersbanner)
7. [HighlightsSection](#highlightssection)
8. [ReviewList](#reviewlist)
9. [QASection](#qasection)
10. [RelatedProductsCarousel](#relatedproductscarousel)
11. [BreadcrumbNav](#breadcrumbnav)
12. [StructuredData](#structureddata)

---

## ImageGallery

**Location**: `components/products/detail/image-gallery.tsx`

### Description
Interactive image carousel with zoom, fullscreen, and thumbnail navigation.

### Props
```typescript
interface ImageGalleryProps {
  images: string[];        // Array of image URLs
  productName: string;     // Product name for accessibility
}
```

### Basic Usage
```tsx
<ImageGallery 
  images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
  productName="Wireless Headphones"
/>
```

### Features
- ✅ Image carousel with navigation arrows
- ✅ Thumbnail grid (5 columns)
- ✅ Zoom on hover
- ✅ Fullscreen preview
- ✅ Image counter
- ✅ Keyboard navigation ready
- ✅ Smooth transitions

### Example Data
```typescript
const images = [
  'https://example.com/product-1.jpg',
  'https://example.com/product-2.jpg',
  'https://example.com/product-3.jpg',
  'https://example.com/product-4.jpg',
  'https://example.com/product-5.jpg',
];
```

---

## ProductInfoSection

**Location**: `components/products/detail/product-info-section.tsx`

### Description
Displays product title, brand, category, ratings, and performance badges.

### Props
```typescript
interface ProductInfoSectionProps {
  title: string;           // Product title
  brand?: string;          // Brand name
  category?: string;       // Category name
  subcategory?: string;    // Subcategory name
  rating: number;          // Average rating (0-5)
  reviewCount: number;     // Total reviews
  sku?: string;           // SKU number
  modelNumber?: string;    // Model number
  isBestSeller?: boolean;  // Show best seller badge
  isNewArrival?: boolean;  // Show new arrival badge
  isLimitedEdition?: boolean; // Show limited edition badge
}
```

### Basic Usage
```tsx
<ProductInfoSection
  title="Premium Wireless Headphones Pro"
  brand="AudioTech"
  category="Electronics"
  subcategory="Audio"
  rating={4.5}
  reviewCount={1250}
  sku="AUD-2024-001"
  isBestSeller={true}
  isNewArrival={false}
/>
```

### Features
- ✅ Responsive typography
- ✅ Performance badges
- ✅ Category path display
- ✅ Ratings with review count
- ✅ SKU and model display
- ✅ Animated appearance

---

## VariantSelector

**Location**: `components/products/detail/variant-selector.tsx`

### Description
Product variant selector with color swatches, size buttons, and price modifiers.

### Props
```typescript
interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (selectedVariants: Record<string, string>) => void;
  basePrice: number;
}

interface ProductVariant {
  id: string;
  type: string;  // 'color', 'size', 'capacity'
  options: {
    name: string;
    value: string;
    image?: string;
    priceModifier?: number;
    stockQuantity?: number;
  }[];
}
```

### Basic Usage
```tsx
const variants = [
  {
    id: 'color',
    type: 'color',
    options: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Silver', value: '#C0C0C0' },
    ],
  },
  {
    id: 'size',
    type: 'size',
    options: [
      { name: 'Small', value: 'S', priceModifier: 0 },
      { name: 'Medium', value: 'M', priceModifier: 10 },
      { name: 'Large', value: 'L', priceModifier: 15 },
    ],
  },
];

<VariantSelector
  variants={variants}
  basePrice={99.99}
  onVariantChange={(selected) => console.log(selected)}
/>
```

### Features
- ✅ Color swatches with visual feedback
- ✅ Size/capacity buttons
- ✅ Real-time price updates
- ✅ Stock validation
- ✅ Disabled state for out of stock
- ✅ Price modifier display

---

## RatingStars

**Location**: `components/products/detail/rating-stars.tsx`

### Description
Reusable star rating component with multiple display and interactive modes.

### Props
```typescript
interface RatingStarsProps {
  rating: number;              // Rating value (0-5)
  reviewCount?: number;        // Number of reviews
  size?: 'sm' | 'md' | 'lg';  // Star size
  showLabel?: boolean;         // Show rating label
  interactive?: boolean;       // Allow user to rate
  onRate?: (rating: number) => void; // Callback on rating
}
```

### Basic Usage - Display Mode
```tsx
<RatingStars 
  rating={4.5}
  reviewCount={1250}
  size="md"
  showLabel={true}
/>
```

### Basic Usage - Interactive Mode
```tsx
<RatingStars 
  rating={0}
  size="lg"
  interactive={true}
  onRate={(rating) => console.log(`Rated: ${rating}`)}
/>
```

### Features
- ✅ Three size options
- ✅ Half-star support
- ✅ Review count display
- ✅ Interactive rating
- ✅ Golden color scheme
- ✅ Smooth transitions

---

## AddToCartSection

**Location**: `components/products/detail/add-to-cart-section.tsx`

### Description
Complete purchase section with pricing, quantity, and action buttons.

### Props
```typescript
interface AddToCartSectionProps {
  productId: string;
  productName: string;
  price: number;
  discountedPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  codAvailable?: boolean;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
  onAddToWishlist: () => void;
  onShare: () => void;
}
```

### Basic Usage
```tsx
<AddToCartSection
  productId="prod_123"
  productName="Headphones"
  price={199.99}
  discountedPrice={149.99}
  inStock={true}
  stockQuantity={25}
  codAvailable={true}
  onAddToCart={(qty) => console.log(`Add ${qty} to cart`)}
  onBuyNow={(qty) => console.log(`Buy ${qty} now`)}
  onAddToWishlist={() => console.log('Added to wishlist')}
  onShare={() => console.log('Share product')}
/>
```

### Features
- ✅ Dynamic pricing display
- ✅ Savings calculation
- ✅ Percentage off badge
- ✅ Stock status indicator
- ✅ Offer banner integration
- ✅ Quantity selector (±buttons)
- ✅ Primary actions (Add/Buy)
- ✅ Secondary actions (Wishlist/Share)
- ✅ Service indicators

---

## OffersBanner

**Location**: `components/products/detail/offers-banner.tsx`

### Description
Display promotional offers, coupon codes, and EMI options.

### Props
```typescript
interface OffersBannerProps {
  offers: OfferData[];
}

interface OfferData {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount?: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'emi';
  badge?: string;
}
```

### Basic Usage
```tsx
const offers = [
  {
    id: 'offer_1',
    title: '20% Flat Discount',
    description: 'On all headphones',
    code: 'SAVE20',
    type: 'percentage',
    badge: '20% OFF',
  },
  {
    id: 'offer_2',
    title: '$50 Cashback',
    description: 'Using selected credit cards',
    type: 'fixed',
    badge: 'Cashback',
  },
];

<OffersBanner offers={offers} />
```

### Features
- ✅ Color-coded by type
- ✅ Copyable coupon codes
- ✅ Copy confirmation
- ✅ EMI payment display
- ✅ Staggered animations
- ✅ Responsive design

---

## HighlightsSection

**Location**: `components/products/detail/highlights-section.tsx`

### Description
Display key product features with checkmark icons.

### Props
```typescript
interface HighlightsSectionProps {
  highlights: string[];
  title?: string;
}
```

### Basic Usage
```tsx
const highlights = [
  '🔋 48-hour battery life',
  '🎵 Noise cancellation',
  '💎 Premium sound quality',
  '⚡ Fast charging (10 mins)',
  '🔐 Secure connection',
];

<HighlightsSection 
  highlights={highlights}
  title="Key Features"
/>
```

### Features
- ✅ Checkmark icons
- ✅ Staggered animations
- ✅ Clean typography
- ✅ Customizable title
- ✅ Responsive layout

---

## ReviewList

**Location**: `components/products/detail/review-list.tsx`

### Description
Comprehensive review system with ratings chart, filtering, and sorting.

### Props
```typescript
interface ReviewListProps {
  reviews: ReviewData[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
}

interface ReviewData {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  unhelpful: number;
  verified?: boolean;
  images?: string[];
}
```

### Basic Usage
```tsx
const reviews = [
  {
    id: 'rev_1',
    author: 'John D.',
    rating: 5,
    title: 'Excellent product',
    comment: 'Best headphones I ever had!',
    date: '2024-01-15',
    helpful: 45,
    unhelpful: 2,
    verified: true,
  },
];

const distribution = [
  { rating: 5, count: 450 },
  { rating: 4, count: 320 },
  { rating: 3, count: 180 },
  { rating: 2, count: 60 },
  { rating: 1, count: 40 },
];

<ReviewList
  reviews={reviews}
  averageRating={4.5}
  totalReviews={1050}
  ratingDistribution={distribution}
/>
```

### Features
- ✅ Rating summary display
- ✅ Distribution bar chart
- ✅ Filter by star rating
- ✅ Sort options (recent, helpful, rating)
- ✅ Verified purchase badge
- ✅ Helpful/unhelpful voting
- ✅ Image support
- ✅ Animated appearance

---

## QASection

**Location**: `components/products/detail/qa-section.tsx`

### Description
Questions and answers section with expandable items and voting.

### Props
```typescript
interface QASectionProps {
  items: QAItem[];
  onAskQuestion?: () => void;
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
  questionBy: string;
  answeredBy?: string;
  helpful: number;
  date: string;
}
```

### Basic Usage
```tsx
const qaItems = [
  {
    id: 'qa_1',
    question: 'Is this compatible with iPhone?',
    answer: 'Yes, compatible with all iPhones.',
    questionBy: 'Mike T.',
    answeredBy: 'Support Team',
    helpful: 32,
    date: '2024-01-10',
  },
];

<QASection
  items={qaItems}
  onAskQuestion={() => console.log('Open ask form')}
/>
```

### Features
- ✅ Expandable Q&A items
- ✅ Smooth animations
- ✅ Helpful voting
- ✅ Author attribution
- ✅ Ask question button
- ✅ Official answer badge

---

## RelatedProductsCarousel

**Location**: `components/products/detail/related-products-carousel.tsx`

### Description
Responsive carousel showing similar or related products.

### Props
```typescript
interface RelatedProductsCarouselProps {
  products: RelatedProduct[];
  title?: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
}
```

### Basic Usage
```tsx
const products = [
  {
    id: 'prod_1',
    name: 'Speaker',
    slug: 'bluetooth-speaker',
    image: 'speaker.jpg',
    price: 79.99,
    discountedPrice: 59.99,
    rating: 4.3,
    reviewCount: 450,
    badge: '25% OFF',
  },
];

<RelatedProductsCarousel
  products={products}
  title="Similar Products"
/>
```

### Features
- ✅ Responsive (1-4 items per view)
- ✅ Navigation arrows
- ✅ Carousel dots
- ✅ Product links
- ✅ Price display
- ✅ Rating display
- ✅ Badge support
- ✅ Add to cart buttons

---

## BreadcrumbNav

**Location**: `components/products/detail/breadcrumb-nav.tsx`

### Description
Breadcrumb navigation with SEO schema markup.

### Props
```typescript
interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}
```

### Basic Usage
```tsx
const items = [
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Audio', href: '/category/audio' },
  { label: 'Headphones', isActive: true },
];

<BreadcrumbNav items={items} />
```

### Features
- ✅ Home button included
- ✅ Clickable links
- ✅ Current page indicator
- ✅ JSON-LD schema
- ✅ Responsive
- ✅ Animated appearance

---

## StructuredData

**Location**: `components/products/detail/structured-data.tsx`

### Description
Renders JSON-LD structured data for SEO.

### Props
```typescript
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
```

### Basic Usage
```tsx
<StructuredData
  productName="Wireless Headphones"
  productDescription="Premium noise-cancelling headphones"
  productImage="headphones.jpg"
  brand="AudioTech"
  price={199.99}
  discountedPrice={149.99}
  availability="InStock"
  rating={4.5}
  reviewCount={1250}
  sku="AUDIO-2024-001"
/>
```

### Features
- ✅ Product schema
- ✅ Pricing information
- ✅ Availability
- ✅ Rating data
- ✅ Search engine optimization
- ✅ Rich snippets support

---

## 🎯 Common Patterns

### Pattern 1: Basic Product Display
```tsx
<>
  <BreadcrumbNav items={breadcrumbItems} />
  <ImageGallery images={images} productName={productName} />
  <ProductInfoSection {...info} />
  <AddToCartSection {...cart} />
</>
```

### Pattern 2: Full Product Page
```tsx
<>
  <StructuredData {...seoData} />
  <BreadcrumbNav items={breadcrumbs} />
  
  <div className="grid lg:grid-cols-3 gap-8">
    <ImageGallery images={images} productName={productName} />
    <div className="lg:col-span-2">
      <ProductInfoSection {...info} />
      <VariantSelector variants={variants} {...variantProps} />
      <OffersBanner offers={offers} />
      <AddToCartSection {...cart} />
    </div>
  </div>

  <HighlightsSection highlights={highlights} />
  <ReviewList reviews={reviews} {...reviewProps} />
  <QASection items={qaItems} />
  <RelatedProductsCarousel products={related} />
</>
```

### Pattern 3: Minimal View
```tsx
<>
  <ImageGallery images={images} productName={productName} />
  <ProductInfoSection title={title} rating={rating} reviewCount={count} />
  <AddToCartSection {...essentialProps} />
</>
```

---

## 🧪 Testing Examples

### Test Adding to Cart
```tsx
const handleAddToCart = (quantity) => {
  console.log(`Added ${quantity} items`);
  // Call API or state update
};
```

### Test Variant Selection
```tsx
const handleVariantChange = (selected) => {
  console.log('Selected variants:', selected);
  // Update pricing based on selection
};
```

### Test Review Filtering
```tsx
// Automatically handled by ReviewList component
// Just provide data and component handles filtering
```

---

## 🚀 Performance Tips

1. **Memoize Props**
   ```tsx
   const memoizedOffers = useMemo(() => offers, [offers]);
   ```

2. **Lazy Load Images**
   ```tsx
   <Image loading="lazy" src={...} />
   ```

3. **Use Keys in Lists**
   ```tsx
   {reviews.map(r => <Review key={r.id} {...r} />)}
   ```

4. **Optimize Callbacks**
   ```tsx
   const handleChange = useCallback((value) => {...}, []);
   ```

---

## 📋 Troubleshooting

### Images Not Loading
- Check image URLs are valid
- Verify image permissions
- Check Next.js Image optimization

### Animations Not Smooth
- Check Framer Motion version
- Verify GPU acceleration
- Test in different browsers

### Types Not Working
- Run `npm install`
- Verify TypeScript version
- Clear `.next` folder

### Components Not Rendering
- Check console for errors
- Verify import paths
- Check prop types match

---

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Next.js Guide](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Complete Reference