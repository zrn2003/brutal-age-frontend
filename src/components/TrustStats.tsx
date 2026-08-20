import React from 'react';
import { ShieldCheck, Clock, Coins, Headphones } from 'lucide-react';

export const TrustStats: React.FC = () => {
  const stats = [
    {
      title: 'Verified Listings & Partner Service',
      desc: 'All account/partner service listings pre-inspected by Admin.',
      code: 'VERIFIED',
      icon: ShieldCheck,
    },
    {
      title: '24-Hour Guaranteed Response',
      desc: 'Guaranteed response within 24 hours for all listing orders & services.',
      code: '24H GUARANTEE',
      icon: Clock,
    },
    {
      title: 'Resource & Clan Coin Service',
      desc: 'resource service & clan coin service available with clean links.',
      code: 'SERVICES',
      icon: Coins,
    },
    {
      title: 'Priority Handover & Rapid Support',
      desc: 'Priority response as soon as possible via WhatsApp communication.',
      code: 'PRIORITY SUPPORT',
      icon: Headphones,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="sharp-card p-5 border-l-4 border-l-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-indigo-600 uppercase">
                    {stat.code}
                  </span>
                  <Icon className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-heading mb-1">
                  {stat.title}
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  {stat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
