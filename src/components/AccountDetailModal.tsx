import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { ZoomIn, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import type { Listing } from '../types';

import { formatImageUrl } from '../utils/imageUtils';

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

  useEffect(() => {
    setSelectedImgIndex(0);
    setLightboxOpen(false);
  }, [listing]);

  if (!listing) return null;

  const rawImages = listing.images && listing.images.length > 0 ? listing.images : ['https://placehold.co/800x500/ffffff/0f172a?text=Brutal+Age'];
  const images = rawImages.map((img) => formatImageUrl(img));

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(listing.price);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.info('Share Link Copied', 'Direct account listing URL copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 left-3">
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

                {/* High-Res Lightbox Badge Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-white" />
                  <span>Click for High-Res Pop-Up</span>
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 border border-slate-800">
                    {selectedImgIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails Bar */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-16 bg-white border-2 flex-shrink-0 transition-all ${
                        idx === selectedImgIndex
                          ? 'border-indigo-600'
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
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                  Brutal Age
                </span>
                <span className="text-xs text-slate-400">
                  Listing ID: <code className="text-slate-800 font-mono">{listing._id}</code>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-heading mb-4">
                {listing.title}
              </h2>

              {/* Price Row */}
              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Selling Price</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading font-mono-num">
                    {formattedPrice}
                  </span>
                </div>
                <button
                  onClick={copyShareLink}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {copied ? 'Copied ✓' : 'Share Link'}
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

      {/* 2. High-Resolution Full-Screen Pop-Up Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-150 font-heading">
          
          {/* Lightbox Top Header */}
          <div className="flex items-center justify-between text-white z-10 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                {listing.title} — High-Res Screenshot Proof
              </h3>
              <span className="text-xs text-slate-400">
                Image {selectedImgIndex + 1} of {images.length} (Uncropped High-Resolution)
              </span>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>CLOSE LIGHTBOX</span>
            </button>
          </div>

          {/* High-Res Center Image Viewer */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 z-20 p-3 bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 transition-colors"
                title="Previous Screenshot"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[selectedImgIndex]}
              alt={listing.title}
              className="max-h-[80vh] max-w-[92vw] object-contain shadow-2xl border border-slate-800 bg-black/40"
            />

            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 z-20 p-3 bg-slate-900/80 text-white border border-slate-700 hover:bg-slate-800 transition-colors"
                title="Next Screenshot"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pt-3 border-t border-slate-800">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-16 h-16 border-2 overflow-hidden flex-shrink-0 transition-all ${
                    idx === selectedImgIndex ? 'border-indigo-500 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
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
