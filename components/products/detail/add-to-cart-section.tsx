'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  CreditCard,
  Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export function AddToCartSection({
  productName,
  price,
  discountedPrice,
  inStock,
  stockQuantity,
  codAvailable = true,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  onShare,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayPrice = discountedPrice || price;
  const savings = price - (discountedPrice || price);
  const savingsPercentage = ((savings / price) * 100).toFixed(0);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      onAddToCart(quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    try {
      onBuyNow(quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist();
  };

  const stockStatus =
    stockQuantity === 0
      ? 'Out of stock'
      : stockQuantity < 5
      ? `Only ${stockQuantity} left`
      : 'In stock';

  return (
    <div className="space-y-6">
      {/* Price Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg"
      >
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${displayPrice.toFixed(2)}
          </span>
          {discountedPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm font-semibold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                {savingsPercentage}% off
              </span>
            </>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </motion.div>

      {/* Stock Status */}
      <div className={`text-sm font-semibold p-3 rounded-lg ${
        inStock && stockQuantity > 0
          ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
      }`}>
        {stockStatus}
      </div>

      {/* Offers Banner */}
      {discountedPrice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 p-3 rounded"
        >
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>Special Offer:</strong> Use code <code className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded font-mono">SAVE20</code> for 20% off!
          </p>
        </motion.div>
      )}

      {/* Quantity Selector */}
      {inStock && (
        <div className="space-y-2">
          <label className="text-sm font-semibold">Quantity</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(val, 1), stockQuantity));
              }}
              className="w-16 text-center"
              min="1"
              max={stockQuantity}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.min(stockQuantity, quantity + 1))}
            >
              +
            </Button>
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleBuyNow}
            disabled={!inStock || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </motion.div>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleWishlist}
          className={isWishlisted ? 'bg-red-50 dark:bg-red-950/20' : ''}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${
              isWishlisted ? 'fill-red-500 stroke-red-500' : ''
            }`}
          />
          Wishlist
        </Button>
        <Button
          variant="outline"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Delivery & Services Info */}
      <div className="space-y-2 border-t pt-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 text-sm"
        >
          <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Free Delivery</p>
            <p className="text-gray-600 dark:text-gray-400">On orders above $50</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-3 text-sm"
        >
          <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">30 Days Return</p>
            <p className="text-gray-600 dark:text-gray-400">Easy returns policy</p>
          </div>
        </motion.div>

        {codAvailable && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 text-sm"
          >
            <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-gray-600 dark:text-gray-400">Available for this product</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}