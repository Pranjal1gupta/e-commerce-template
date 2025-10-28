'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  actual_MRP?: number;
  discounted_price?: number;
  percentage_discount?: number;
  images: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  is_hot_deal?: boolean;
  has_offer?: boolean;
  is_new_arrival?: boolean;
  is_featured?: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find(item => item.product_id === product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-[440px] flex flex-col overflow-hidden group max-w-xs mx-auto">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-110 duration-300"
            />
            {product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Only {product.stock_quantity} left
              </div>
            )}
            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
            {/* Badge Section */}
            <div className="absolute top-0 left-0 right-0 px-3 py-2 flex flex-wrap gap-1 z-20 ">
              {product.is_hot_deal && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold shadow-md">
                  🔥 HOT
                </span>
              )}
              {product.has_offer && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold shadow-md">
                  💎 OFFER
                </span>
              )}
              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold shadow-md">
                  ⭐ TOP
                </span>
              )}
              {product.is_new_arrival && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold shadow-md">
                  ✨ NEW
                </span>
              )}
            </div>
          </div>
        </Link>
        <CardContent className="flex-1 p-4 flex flex-col justify-between min-h-0">
          <div>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.review_count})</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {product.actual_MRP && (
              <p className="text-lg text-muted-foreground line-through">
                ₹{product.actual_MRP.toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-primary">
              ₹{product.discounted_price ? product.discounted_price.toFixed(2) : product.base_price.toFixed(2)}
            </p>
            {product.percentage_discount && (
              <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                {product.percentage_discount}% OFF
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex-shrink-0">
          {cartItem ? (
            <div className="w-full flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (cartItem.quantity - 1 === 0) {
                    removeFromCart(cartItem.id);
                  } else {
                    updateQuantity(cartItem.id, cartItem.quantity - 1);
                  }
                }}
              >
                -
              </Button>
              <span className="text-lg font-semibold">{cartItem.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.stock_quantity}
              >
                +
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => addToCart(product.id)}
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
