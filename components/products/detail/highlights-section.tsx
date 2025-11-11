'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react';

interface HighlightsSectionProps {
  highlights: string[];
  title?: string;
}

export function HighlightsSection({ highlights, title = 'Key Features' }: HighlightsSectionProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        {title}
      </h2>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {highlights.map((highlight, index) => (
          <motion.li key={index} variants={item} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}