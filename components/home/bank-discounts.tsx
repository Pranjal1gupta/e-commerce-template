'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

type BankDiscount = {
  id: string;
  banks: string[];
  discount: string;
  discountValue: string;
  couponCode: string;
  terms: string;
  images: string[];
  validity: string;
};

const bankDiscounts: BankDiscount[] = [
  {
    id: '1',
    banks: ['Canara Bank', 'Federal Bank'],
    discount: '10% Instant Discount',
    discountValue: '10%',
    couponCode: 'CANARA10',
    terms: 'Min. purchase ₹999',
    images: [
      'https://tse2.mm.bing.net/th/id/OIP.jgTzcRd3_QJYwLaj8bq4XwHaFj?pid=Api&P=0&h=220',
      'https://bfsi.eletsonline.com/wp-content/uploads/2017/07/federal-bank-logo-HD.jpg'
    ],
    validity: 'Valid till 31 Dec 2024'
  },
  {
    id: '2',
    banks: ['HDFC Bank'],
    discount: '15% Cashback',
    discountValue: '15%',
    couponCode: 'HDFC15CB',
    terms: 'Max cashback ₹1000',
    images: [
      'https://www.theindianwire.com/wp-content/uploads/2021/04/HDFC-bank.png'
    ],
    validity: 'Valid till 31 Dec 2024'
  },
  {
    id: '3',
    banks: ['ICICI Bank', 'Axis Bank'],
    discount: '12% Instant Discount',
    discountValue: '12%',
    couponCode: 'ICICIAXIS12',
    terms: 'Min. purchase ₹1500',
    images: [
      'https://i.pinimg.com/originals/8e/3e/d0/8e3ed0a2a12839591305528a8ac95b2c.png',
      'https://tse4.mm.bing.net/th/id/OIP.vuay4ohGaUxfnmT1r9XFZQHaHa?pid=Api&P=0&h=220'
    ],
    validity: 'Valid till 31 Dec 2024'
  },
  {
    id: '4',
    banks: ['SBI Bank'],
    discount: '5% Cashback',
    discountValue: '5%',
    couponCode: 'SBI5CASH',
    terms: 'Max cashback ₹500',
    images: [
      'https://i.pinimg.com/originals/2a/2c/1d/2a2c1d90075390b22e7e6060254dab0d.jpg'
    ],
    validity: 'Valid till 31 Dec 2024'
  },
];

export default function BankDiscounts() {
  const [current, setCurrent] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const nextTimer = setInterval(() => {
      setCurrent(prev => (prev + 1) % bankDiscounts.length);
      setIsFlipped(false);
    }, 6000);

    return () => clearInterval(nextTimer);
  }, []);

  const bank = bankDiscounts[current];

  const handleCopy = () => {
    navigator.clipboard.writeText(bank.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
          >
            Exclusive Bank Coupons
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 text-lg"
          >
            Unlock amazing discounts with your favorite banks
          </motion.p>
        </div>

        {/* Coupon Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-4xl cursor-pointer perspective-1000"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="relative h-64 transform-style-preserve-3d"
          >
            {/* Front - Coupon Display */}
            <div className="absolute inset-0 backface-hidden">
              <div className="h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-700 dark:via-blue-800 dark:to-purple-800 rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
                {/* Decorative dashed divider */}
                <div className="absolute right-1/3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-white/30"></div>

                <div className="h-full flex">
                  {/* Left Section - Bank Logos & Details */}
                  <div className="w-2/3 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      {bank.images.map((img, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg"
                        >
                          <img
                            src={img}
                            alt={bank.banks[i]}
                            className="h-12 w-auto object-contain"
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-white/80 text-sm font-semibold mb-2">SPECIAL OFFER</p>
                      <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                        {bank.discount}
                      </h3>
                      <p className="text-white/90 text-sm mb-4">{bank.terms}</p>
                      <p className="text-xs text-white/60">{bank.validity}</p>
                    </motion.div>
                  </div>

                  {/* Right Section - Discount Value */}
                  <div className="w-1/3 p-8 flex flex-col justify-center items-center bg-white/10 backdrop-blur-sm relative">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-center"
                    >
                      <p className="text-white/70 text-xs font-semibold mb-2">SAVE UP TO</p>
                      <p className="text-white text-5xl font-black">{bank.discountValue}</p>
                      <p className="text-white/70 text-xs mt-2">Click to reveal code</p>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
              </div>
            </div>

            {/* Back - Coupon Code */}
            <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
              <div className="h-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 dark:from-purple-700 dark:via-pink-600 dark:to-red-600 rounded-2xl shadow-2xl border-2 border-white/20 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-white/80 text-sm font-semibold mb-4 uppercase tracking-widest">
                    Coupon Code
                  </p>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6 border-2 border-dashed border-white/40 hover:border-white/60 transition-all">
                    <p className={`text-white text-4xl font-black tracking-wider font-mono mb-4 transition-all ${!isFlipped ? 'blur-sm' : ''}`} style={{ transform: 'scaleX(-1)' }}>
                      {bank.couponCode}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                      }}
                      className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/30 hover:bg-white/40 text-white rounded-lg transition-all text-sm font-semibold"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-white/90 text-sm">
                    <p className="font-semibold">{bank.discount}</p>
                    <p className="text-white/70 text-xs">{bank.terms}</p>
                    <p className="text-white/60 text-xs">{bank.validity}</p>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Click Hint */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 dark:text-gray-400 text-sm mt-8 text-center"
        >
          💡 Click the card to reveal coupon code
        </motion.p>

        {/* Navigation Dots */}
        <div className="flex gap-3 mt-12">
          {bankDiscounts.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setCurrent(i);
                setIsFlipped(false);
              }}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-3'
                  : 'bg-gray-300 dark:bg-gray-600 w-3 h-3 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
