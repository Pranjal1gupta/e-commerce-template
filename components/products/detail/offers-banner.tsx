'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export interface OfferData {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount?: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'emi';
  badge?: string;
}

interface OffersBannerProps {
  offers: OfferData[];
}

export function OffersBanner({ offers }: OffersBannerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500';
      case 'fixed':
        return 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500';
      case 'bogo':
        return 'bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500';
      case 'emi':
        return 'bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-indigo-500';
      default:
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'text-green-700 dark:text-green-300';
      case 'fixed':
        return 'text-blue-700 dark:text-blue-300';
      case 'bogo':
        return 'text-purple-700 dark:text-purple-300';
      case 'emi':
        return 'text-indigo-700 dark:text-indigo-300';
      default:
        return 'text-yellow-700 dark:text-yellow-300';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Available Offers
      </h3>

      <AnimatePresence>
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className={`${getBgColor(offer.type)} p-4 rounded-lg ${getTextColor(offer.type)}`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{offer.title}</p>
                  {offer.description && (
                    <p className="text-xs opacity-90 mt-1">{offer.description}</p>
                  )}
                </div>
                {offer.badge && (
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded whitespace-nowrap">
                    {offer.badge}
                  </span>
                )}
              </div>

              {offer.code && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <code className="bg-white/30 px-2 py-1 rounded text-xs font-mono font-semibold flex-1">
                    {offer.code}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(offer.code!)}
                    className={`h-8 w-8 p-0 transition-colors ${
                      copiedCode === offer.code
                        ? 'bg-white/40'
                        : 'hover:bg-white/20'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* EMI Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-indigo-500 p-3 rounded-lg text-indigo-700 dark:text-indigo-300 text-sm"
      >
        💳 <strong>EMI Available:</strong> Starting at $0/month with select cards
      </motion.div>
    </div>
  );
}