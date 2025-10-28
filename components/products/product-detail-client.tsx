'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ProductCard } from './product-card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function ProductDetailClient({ product, reviews, relatedProducts }: any) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const { addToCart } = useCart();

  const price = product.base_price + (selectedVariant?.price_adjustment || 0);
  const stock = selectedVariant?.stock_quantity || product.stock_quantity;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            {product.category ? (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">Uncategorized</span>
            )}
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.review_count} reviews)
            </span>
          </div>

          <div className="text-4xl font-bold text-primary">₹{price.toFixed(2)}</div>

          {product.variants && product.variants.colors && (
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex gap-2">
                {product.variants.colors.map((color: string) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.variants && product.variants.sizes && (
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex gap-2">
                {product.variants.sizes.map((size: string) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Badge variant={stock > 0 ? 'default' : 'destructive'}>
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </Badge>
            {product.is_new_arrival && <Badge variant="secondary">New Arrival</Badge>}
            {product.is_featured && <Badge variant="secondary">Featured</Badge>}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => addToCart(product.id)}
              disabled={stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <p className="whitespace-pre-line">{product.description}</p>
          </Card>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            {product.specifications ? (
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-semibold capitalize">{key.replace(/_/g, ' ')}</dt>
                    <dd className="text-muted-foreground">{value as string}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-muted-foreground">No specifications available</p>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{review.user?.full_name || 'Anonymous'}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
