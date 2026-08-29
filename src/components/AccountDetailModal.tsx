import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { ZoomIn, ChevronLeft, ChevronRight, X, Maximize2, Share2, Check } from 'lucide-react';
import type { Listing } from '../types';
import { getApiBaseUrl } from '../config/api';
import { formatImageUrl } from '../utils/imageUtils';
import { getShortProductCode, getShortProductUrl } from '../utils/permalinkUtils';

interface AccountDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onAddToCart?: (listing: Listing) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  listing,
  onClose,
  onAddToCart,
}) => {
  const toast = useToast();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullListing, setFullListing] = useState<Listing | null>(null);

  useEffect(() => {
    setSelectedImgIndex(0);
    setLightboxOpen(false);
    if (listing) {
      setFullListing(listing);
      // Fetch full listing details to get complete gallery if feed images were truncated
      const apiBase = getApiBaseUrl();
      fetch(`${apiBase}/listings/${listing._id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: Listing | null) => {
          if (data && data.images && data.images.length > 0) {
            setFullListing(data);
          }
        })
        .catch(() => {});
    } else {
      setFullListing(null);
    }
  }, [listing]);

  if (!listing) return null;
  const activeListing = fullListing || listing;

  const rawImages = activeListing.images && activeListing.images.length > 0 ? activeListing.images : ['https://placehold.co/800x500/ffffff/0f172a?text=Brutal+Age'];
  const images = rawImages.map((img) => formatImageUrl(img));

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.price);

  const shortCode = getShortProductCode(listing._id);
  const productPermalink = getShortProductUrl(listing._id);

  const copyShareLink = () => {
    navigator.clipboard.writeText(productPermalink);
    setCopied(true);
    toast.info('Direct Product Link Copied', `Copied link: ${productPermalink}`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrevImage = () => {
    setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* 1. Account Detail Modal Box */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-heading">
        
        <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-none shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row font-heading">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 px-3 py-1 bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 text-xs font-bold shadow-xs"
          >
            CLOSE [✕]
          </button>

          {/* Left: Gallery & Screenshots */}
          <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-300">
            <div>
              {/* Main Image Box with Zoom Trigger */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative aspect-[4/3] bg-white border border-slate-300 overflow-hidden cursor-pointer group"
              >
                <img
                  src={images[selectedImgIndex]}
                  alt={listing.title}
                  className="w-full h-full object-contain bg-slate-950 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/0f172a/ffffff?text=Brutal+Age+Verified+Screenshot';
                  }}
                />
                
                <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to Expand</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[10px] font-mono-num px-2 py-0.5 font-bold">
                  {selectedImgIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails Navigation Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-14 h-14 border flex-shrink-0 transition-all ${
                        selectedImgIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                          : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-700">✓ High-Resolution Screenshot Proof</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Click screenshot to open full-screen pop-up</p>
              </div>
              <button
                onClick={() => setLightboxOpen(true)}
                className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-slate-800"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full-Screen</span>
              </button>
            </div>
          </div>

          {/* Right: Specs & Account Details */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto font-heading">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white font-mono-num">
                    Brutal Age
                  </span>
                  <span className="text-xs text-slate-400">
                    Listing ID: <code className="text-slate-800 font-mono text-[11px]">{listing._id}</code>
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-heading mb-4">
                {listing.title}
              </h2>

              {/* Price Row & Share Button */}
              <div className="mb-4 p-4 bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Selling Price</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading font-mono-num">
                    {formattedPrice}
                  </span>
                </div>

                <button
                  onClick={copyShareLink}
                  className={`px-3.5 py-2 text-xs font-extrabold uppercase flex items-center gap-1.5 border transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
                  }`}
                  title="Copy direct product link"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-indigo-600" />}
                  <span>{copied ? 'Copied!' : 'Share Product Link'}</span>
                </button>
              </div>

              {/* Share Permalink Box */}
              <div className="mb-6 p-2 bg-indigo-50/70 border border-indigo-200 text-[11px] text-indigo-900 font-medium flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-bold uppercase text-[9px] text-indigo-700 block">Direct Share Permalink:</span>
                  <code className="font-mono text-[11px] text-indigo-900 truncate block">/p/{shortCode}</code>
                </div>
                <button
                  onClick={copyShareLink}
                  className="text-indigo-700 hover:text-indigo-900 underline font-bold flex-shrink-0 text-[10px]"
                >
                  Copy URL
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Leadership LEVEL</span>
                  <span className="text-xs font-bold text-slate-900 font-heading">{listing.level || 'Leadership LEVEL 350'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">relocation tickets</span>
                  <span className="text-xs font-bold text-indigo-700 font-heading">{listing.rank || '15 Relocation Tickets'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-slate-500 mb-1">Description</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 border border-slate-200">
                  {listing.description || 'No additional description provided.'}
                </p>
              </div>
            </div>

            {/* Add to Cart Action */}
            <div className="pt-4 border-t border-slate-200">
              {listing.status === 'Available' ? (
                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart(listing);
                    onClose();
                  }}
                  className="btn-indigo w-full py-3.5 text-xs uppercase font-extrabold tracking-wider"
                >
                  Add to Cart & Checkout
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 text-xs uppercase font-extrabold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                >
                  Account is {listing.status}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. High-Resolution Full-Screen Lightbox Viewer */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 font-heading">
          
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase text-indigo-400 font-heading">
                High-Resolution Image Viewer ({selectedImgIndex + 1} of {images.length})
              </span>
              <h4 className="text-sm font-black truncate max-w-md text-white font-heading">
                {listing.title}
              </h4>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-none border border-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Close Lightbox</span>
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={images[selectedImgIndex]}
              alt={listing.title}
              className="max-w-full max-h-[78vh] object-contain shadow-2xl border border-slate-800"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 text-white hover:bg-indigo-600 border border-slate-700 transition-colors shadow-lg"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 text-white hover:bg-indigo-600 border border-slate-700 transition-colors shadow-lg"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 border-t border-slate-800">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-12 h-12 border transition-all ${
                    selectedImgIndex === idx
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                      : 'border-slate-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  );
};
