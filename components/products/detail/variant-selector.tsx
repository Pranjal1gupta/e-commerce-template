'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface ProductVariant {
  id: string;
  type: string; // 'color', 'size', 'capacity', etc.
  options: {
    name: string;
    value: string;
    image?: string;
    priceModifier?: number;
    stockQuantity?: number;
  }[];
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (selectedVariants: Record<string, string>) => void;
  basePrice: number;
}

export function VariantSelector({
  variants,
  onVariantChange,
  basePrice,
}: VariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantSelect = (variantType: string, value: string) => {
    const updated = { ...selectedVariants, [variantType]: value };
    setSelectedVariants(updated);
    onVariantChange(updated);
  };

  const getModifiedPrice = () => {
    let totalModifier = 0;
    Object.entries(selectedVariants).forEach(([variantType, value]) => {
      const variant = variants.find((v) => v.type === variantType);
      if (variant) {
        const option = variant.options.find((o) => o.value === value);
        if (option?.priceModifier) {
          totalModifier += option.priceModifier;
        }
      }
    });
    return basePrice + totalModifier;
  };

  const isColorVariant = (variantType: string) => variantType.toLowerCase() === 'color';

  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <div key={variant.type} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-gray-900 dark:text-gray-100">
              {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
            </label>
            {selectedVariants[variant.type] && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Selected: <strong>{selectedVariants[variant.type]}</strong>
              </span>
            )}
          </div>

          {isColorVariant(variant.type) ? (
            // Color swatches
            <div className="flex flex-wrap gap-3">
              {variant.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVariantSelect(variant.type, option.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedVariants[variant.type] === option.value
                      ? 'border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title={option.name}
                  style={{
                    backgroundColor: option.value.toLowerCase(),
                  }}
                >
                  {selectedVariants[variant.type] === option.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            // Button options for size, capacity, etc.
            <div className="flex flex-wrap gap-2">
              {variant.options.map((option) => (
                <motion.div key={option.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={
                      selectedVariants[variant.type] === option.value ? 'default' : 'outline'
                    }
                    onClick={() => handleVariantSelect(variant.type, option.value)}
                    disabled={option.stockQuantity === 0}
                    className={`relative ${
                      option.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {option.name}
                    {option.priceModifier ? (
                      <span className="ml-1 text-xs">
                        {option.priceModifier > 0 ? '+' : ''}{option.priceModifier > 0 ? `$${option.priceModifier}` : `-$${Math.abs(option.priceModifier)}`}
                      </span>
                    ) : null}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Price adjustment info */}
          {Object.keys(selectedVariants).length > 0 && getModifiedPrice() !== basePrice && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Price after variant selection: <strong>${getModifiedPrice().toFixed(2)}</strong>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}