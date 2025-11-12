import { Shield, Receipt, Truck, RotateCcw, CreditCard, Headphones, Award, RefreshCw, Lock, Star } from 'lucide-react';

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      text: '12+3 Months\nWarranty',
    },
    {
      icon: Receipt,
      text: 'GST\nBilling',
    },
    {
      icon: Truck,
      text: 'Free Express\nDelivery*',
    },
    {
      icon: RotateCcw,
      text: '7-day\nReplacement',
    },
    {
      icon: CreditCard,
      text: 'Secure\nPayments',
    },
    {
      icon: Headphones,
      text: '24/7\nSupport',
    },
    {
      icon: Award,
      text: 'Quality\nAssured',
    },
    {
      icon: RefreshCw,
      text: 'Easy\nReturns',
    },
    {
      icon: Lock,
      text: '100%\nSafe',
    },
    {
      icon: Star,
      text: '4.8/5\nRating',
    },
  ];

  return (
    <div className="bg-white py-10 border-b">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 lg:flex lg:justify-center lg:items-center lg:gap-10 lg:overflow-x-auto">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex flex-col items-center text-center lg:flex-shrink-0 lg:px-2">
              <indicator.icon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-pre-line leading-tight">
                {indicator.text}
              </span>
            </div>
          ))}

        </div>
      </div>
    </div>
  );

}
