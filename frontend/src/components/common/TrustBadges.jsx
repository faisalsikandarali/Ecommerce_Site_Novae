import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Shipping',
    subtitle: 'On orders over Rs. 5,000'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    subtitle: '100% encrypted & protected'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    subtitle: '30-day hassle-free policy'
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    subtitle: 'Dedicated stylist helpline'
  }
];

export const TrustBadges = () => {
  return (
    <div className="border-y border-stone-200/80 bg-white/70 backdrop-blur-sm py-4 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300 shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold tracking-wide text-stone-900 uppercase">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
