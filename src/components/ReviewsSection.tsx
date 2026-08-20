import React from 'react';
import { Star, CheckCircle2, UserCheck } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Rohan Sharma',
      game: 'PUBG Mobile',
      rank: 'Conqueror S22',
      rating: 5,
      date: '2 days ago',
      comment: 'Got my Conqueror Glacier M416 account within 10 minutes on WhatsApp! Admin gave full email transfer access. 100% legit marketplace!',
      badge: 'Verified Buyer',
    },
    {
      name: 'Vikram A.',
      game: 'Valorant',
      rank: 'Radiant #340',
      rating: 5,
      date: '4 days ago',
      comment: 'Account came with Kuronami Vandal and Karambit knife as described. Smooth handover, highly recommend Brutal Age!',
      badge: 'Verified Buyer',
    },
    {
      name: 'Aman Patel',
      game: 'BGMI',
      rank: 'Ace Master',
      rating: 5,
      date: '1 week ago',
      comment: 'Super fast response on WhatsApp. Golden Pharaoh X-Suit Lv 4 account delivered cleanly. Best gaming account seller!',
      badge: 'Verified Buyer',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
          <UserCheck className="w-4 h-4" /> Customer Reviews & Sales Proof
        </span>
        <h3 className="text-3xl font-extrabold text-white font-heading">
          TRUSTED BY GAMERS NATIONWIDE
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Read genuine feedback from players who bought their verified accounts via our direct WhatsApp handover process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {rev.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-white font-heading">{rev.name}</span>
                <span className="text-[11px] text-cyan-400 font-medium">{rev.game} ({rev.rank})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
