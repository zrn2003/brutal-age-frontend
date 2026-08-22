import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import type { Listing, BuyerUser } from '../types';
import { AccountDetailModal } from './AccountDetailModal';
import { formatImageUrl } from '../utils/imageUtils';
import { getShortProductUrl } from '../utils/permalinkUtils';
import { useToast } from '../context/ToastContext';

interface ListingsSectionProps {
  listings: Listing[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  buyerUser: BuyerUser | null;
  onAddToCart: (listing: Listing) => void;
  onRequireLogin: (promptMsg: string) => void;
}

export const ListingsSection: React.FC<ListingsSectionProps> = ({
  listings,
  searchQuery,
  onSearchChange,
  buyerUser,
  onAddToCart,
  onRequireLogin,
}) => {
  const toast = useToast();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Sold'>('All');
  
  // Price Range Filter ($200 to $25,000)
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  
  // Leadership Level Filter (0K to 900K Range)
  const [minLeadershipLevel, setMinLeadershipLevel] = useState<number>(0);
  const [maxLeadershipLevel, setMaxLeadershipLevel] = useState<number>(900);

  // Default Sort Order: Price Low to High
  const [sortBy, setSortBy] = useState<'priceAsc' | 'priceDesc' | 'newest'>('priceAsc');

  // Leadership Range Preset Buttons
  const leadershipRanges = [
    { label: 'All', min: 0, max: 900 },
    { label: '0-100K', min: 0, max: 100 },
    { label: '100K-200K', min: 100, max: 200 },
    { label: '200K-300K', min: 200, max: 300 },
    { label: '300K-400K', min: 300, max: 400 },
    { label: '400K-500K', min: 400, max: 500 },
    { label: '500K-600K', min: 500, max: 600 },
    { label: '600K-700K', min: 600, max: 700 },
    { label: '700K-800K', min: 700, max: 800 },
    { label: '800K-900K', min: 800, max: 900 },
  ];

  // Helper to extract numeric Leadership Level from string e.g. "Leadership LEVEL 350" -> 350
  const extractLeadershipLevel = (levelStr: string): number => {
    const match = levelStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 35;
  };

  const filteredListings = useMemo(() => {
    let result = listings.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (item.price > maxPrice) return false;

      // Leadership Level Filter (Min to Max Range)
      const itemLevelNum = extractLeadershipLevel(item.level);
      if (itemLevelNum < minLeadershipLevel || itemLevelNum > maxLeadershipLevel) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const rankMatch = item.rank.toLowerCase().includes(query);
        const levelMatch = item.level.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        if (!titleMatch && !rankMatch && !levelMatch && !descMatch) return false;
      }

      return true;
    });

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [listings, statusFilter, maxPrice, minLeadershipLevel, maxLeadershipLevel, searchQuery, sortBy]);

  const handleAddToCartClick = (listing: Listing) => {
    if (!buyerUser) {
      onRequireLogin(`Please sign in or create a buyer account to add "${listing.title}" to your shopping cart.`);
      return;
    }
    onAddToCart(listing);
  };

  const formatPriceUSD = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-heading">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <span className="block text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 mb-1 font-heading">
            Brutal Age Accounts & Services
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            AVAILABLE BRUTAL AGE LISTINGS
          </h3>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center border border-slate-300 bg-white p-1 self-start md:self-auto">
          {(['All', 'Available', 'Sold'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'All' ? 'All Accounts' : status === 'Available' ? 'Available' : 'Sold Proof'}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Interactive Sliders: Price ($200 - $25,000) & Leadership Ranges (0-100K up to 800K-900K) */}
      <div className="bg-white p-5 border border-slate-300 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
        
        {/* 1. Price Range Slider ($200 to $25,000) */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
            <span>Price Filter Range</span>
            <span className="text-indigo-600 font-heading text-sm">{formatPriceUSD(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="200"
            max="25000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-1 mb-2">
            <span>$200</span>
            <span>$25,000</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {[1000, 5000, 15000, 25000].map((p) => (
              <button
                key={p}
                onClick={() => setMaxPrice(p)}
                className={`text-[10px] font-bold px-2 py-0.5 border ${
                  maxPrice === p
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                ≤ ${p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Leadership Range Preset Buttons (0-100K up to 800K-900K) */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
            <span>Leadership</span>
            <span className="text-indigo-600 font-heading text-sm">
              {minLeadershipLevel === 0 && maxLeadershipLevel === 900
                ? 'All Ranges'
                : `${minLeadershipLevel}K - ${maxLeadershipLevel}K`}
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="900"
            step="5"
            value={maxLeadershipLevel}
            onChange={(e) => {
              setMinLeadershipLevel(0);
              setMaxLeadershipLevel(Number(e.target.value));
            }}
            className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mt-1 mb-2 font-mono-num">
            <span>0K</span>
            <span>900K</span>
          </div>

          {/* Interactive Range Preset Buttons */}
          <div className="flex flex-wrap gap-1 font-mono-num">
            {leadershipRanges.map((range) => {
              const isActive = minLeadershipLevel === range.min && maxLeadershipLevel === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    setMinLeadershipLevel(range.min);
                    setMaxLeadershipLevel(range.max);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 border transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 font-black shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Search & Sort Controls */}
        <div className="flex flex-col justify-between space-y-2">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Search Keyword
            </label>
            <input
              type="text"
              placeholder="Search title, level, relocation tickets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 border border-slate-300 focus:outline-none focus:border-slate-900 font-bold"
            >
              <option value="priceAsc">Price: Low to High (Default)</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs">
        <span className="font-semibold text-slate-600">
          Showing <strong className="text-slate-900">{filteredListings.length}</strong> Brutal Age listings (Sorted by Low Price First)
        </span>
        {(searchQuery || statusFilter !== 'All' || maxPrice < 25000 || minLeadershipLevel > 0 || maxLeadershipLevel < 900 || sortBy !== 'priceAsc') && (
          <button
            onClick={() => {
              onSearchChange('');
              setStatusFilter('All');
              setMaxPrice(25000);
              setMinLeadershipLevel(0);
              setMaxLeadershipLevel(900);
              setSortBy('priceAsc');
            }}
            className="text-indigo-600 hover:underline font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Brutal Age Account Cards */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const rawCover = listing.images && listing.images.length > 0 ? listing.images[0] : 'https://placehold.co/600x400/ffffff/0f172a?text=Brutal+Age';
            const coverImage = formatImageUrl(rawCover);

            return (
              <div
                key={listing._id}
                className="sharp-card sharp-card-hover flex flex-col justify-between"
              >
                <div>
                  {/* Clickable Cover Image for Instant Unrestricted View */}
                  <div
                    onClick={() => setSelectedListing(listing)}
                    className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-200 cursor-pointer group"
                  >
                    <img
                      src={coverImage}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-slate-900 text-white font-mono-num">
                        {listing.level}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase border ${
                          listing.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold">
                      <span className="text-indigo-600 uppercase">{listing.rank}</span>
                    </div>

                    <h4
                      onClick={() => setSelectedListing(listing)}
                      className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2 font-heading cursor-pointer hover:text-indigo-600 transition-colors"
                    >
                      {listing.title}
                    </h4>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Price</span>
                    <span className="text-lg font-extrabold text-slate-900 font-heading font-mono-num">
                      {formatPriceUSD(listing.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Share Product Permalink Button */}
                    <button
                      onClick={() => {
                        const shareUrl = getShortProductUrl(listing._id);
                        navigator.clipboard.writeText(shareUrl);
                        toast.info('Direct Product Link Copied', `Copied link: ${shareUrl}`);
                      }}
                      className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                      title="Copy direct product link (/p/:id)"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-600 hover:text-indigo-600" />
                    </button>
                    {/* Free Unrestricted Details Viewer */}
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="btn-outline px-3 py-1.5 text-xs font-bold"
                    >
                      Details
                    </button>
                    {listing.status === 'Available' && (
                      <button
                        onClick={() => handleAddToCartClick(listing)}
                        className="btn-indigo px-3 py-1.5 text-xs font-extrabold uppercase"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 text-center border border-slate-300 max-w-md mx-auto">
          <h4 className="text-base font-bold text-slate-900 mb-1">No Accounts Match Your Criteria</h4>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your price slider ($200-$25,000) or Leadership range ({minLeadershipLevel}K-{maxLeadershipLevel}K).
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setStatusFilter('All');
              setMaxPrice(25000);
              setMinLeadershipLevel(0);
              setMaxLeadershipLevel(900);
              setSortBy('priceAsc');
            }}
            className="btn-primary px-4 py-2 text-xs font-bold uppercase"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Unrestricted Detail Drawer Modal */}
      <AccountDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onAddToCart={handleAddToCartClick}
      />

    </section>
  );
};
