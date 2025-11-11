'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  questionBy: string;
  answeredBy?: string;
  helpful: number;
  date: string;
}

interface QASectionProps {
  items: QAItem[];
  onAskQuestion?: () => void;
}

export function QASection({ items, onAskQuestion }: QASectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [helpful, setHelpful] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleHelpful = (id: string) => {
    const updated = new Set(helpful);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setHelpful(updated);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Questions & Answers
        </h2>
        {onAskQuestion && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAskQuestion}
          >
            Ask a Question
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Question */}
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Q: {item.question}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Asked by {item.questionBy} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <motion.div
                animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-2 flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-800/50 border-t"
                >
                  <div className="p-4 space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        A: {item.answeredBy ? `Answer by ${item.answeredBy}` : 'Official Answer'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {item.answer}
                      </p>
                    </div>

                    {/* Helpful Action */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHelpful(item.id)}
                        className={`text-xs ${
                          helpful.has(item.id)
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-1 ${helpful.has(item.id) ? 'fill-current' : ''}`} />
                        Helpful ({item.helpful + (helpful.has(item.id) ? 1 : 0)})
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}