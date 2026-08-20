import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, UserCheck, MessageSquare, Phone, MessageCircle, Send, Check } from 'lucide-react';
import type { CartItem, BuyerUser } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (listingId: string) => void;
  onClearCart: () => void;
  buyerUser: BuyerUser | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  buyerUser,
}) => {
  const [communicationMode, setCommunicationMode] = useState<'whatsapp' | 'wechat' | 'line' | 'telegram'>('whatsapp');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.listing.price, 0);

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(subtotal);

  // Official Channels
  const officialWhatsAppNumber = '917517491313';
  const officialLineUrl = 'https://line.me/R/ti/g/aM3NznSNe2';
  const officialTelegramUsername = 'Raindrop132613';
  const officialWeChatId = 'Raindrop132613';

  const cartListText = cartItems
    .map((item, idx) => `${idx + 1}. ${item.listing.title} ($${item.listing.price.toLocaleString()})`)
    .join('\n');

  const buyerInfoText = buyerUser ? `Buyer: ${buyerUser.name} (${buyerUser.email})` : 'Buyer: Guest';

  const plainOrderDetails = 
    `Hi Brutal Age AB's Marketplace!\nI would like to purchase the following accounts/services from my cart:\n\n` +
    `${cartListText}\n\n` +
    `Total Price: ${formattedSubtotal}\n` +
    `${buyerInfoText}\n\n` +
    `Please confirm instant handover availability!`;

  const checkoutMessageEncoded = encodeURIComponent(plainOrderDetails);

  const whatsappCheckoutUrl = `https://wa.me/${officialWhatsAppNumber}?text=${checkoutMessageEncoded}`;
  const telegramCheckoutUrl = `https://t.me/${officialTelegramUsername}?text=${checkoutMessageEncoded}`;

  const handleCheckoutSubmit = () => {
    if (communicationMode === 'whatsapp') {
      window.open(whatsappCheckoutUrl, '_blank');
    } else if (communicationMode === 'telegram') {
      window.open(telegramCheckoutUrl, '_blank');
    } else if (communicationMode === 'line') {
      navigator.clipboard.writeText(plainOrderDetails);
      setCopiedNotification('Line Order Copied! Redirecting to Line...');
      alert('Your complete cart order details have been copied to clipboard! Redirecting to Line...');
      window.open(officialLineUrl, '_blank');
      setTimeout(() => setCopiedNotification(null), 3000);
    } else if (communicationMode === 'wechat') {
      const copyContent = `WeChat ID: ${officialWeChatId}\n\n${plainOrderDetails}`;
      navigator.clipboard.writeText(copyContent);
      setCopiedNotification('WeChat ID & Order Copied!');
      alert(`WeChat ID '${officialWeChatId}' and your full cart order details have been copied to clipboard! Paste it directly into WeChat.`);
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-heading">
      
      {/* Drawer Box */}
      <div className="w-full max-w-md bg-white border-l border-slate-300 h-full flex flex-col justify-between p-6 shadow-2xl font-heading">
        
        {/* Top Bar */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  YOUR SHOPPING CART
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 bg-slate-50 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Logged In Buyer Status */}
          {buyerUser && (
            <div className="mb-4 p-2.5 bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-medium flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Checkout Account: <strong>{buyerUser.name}</strong> ({buyerUser.email})</span>
            </div>
          )}

          {/* Cart Items List */}
          {cartItems.length > 0 ? (
            <div className="space-y-3 max-h-[42vh] sm:max-h-[48vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.listing._id}
                  className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <img
                    src={item.listing.images[0] || 'https://placehold.co/100x100'}
                    alt=""
                    className="w-14 h-14 object-cover border border-slate-300 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-extrabold uppercase text-indigo-600">
                      {item.listing.level} • {item.listing.rank}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate font-heading">
                      {item.listing.title}
                    </h5>
                    <span className="text-sm font-extrabold text-slate-900 font-heading font-mono-num">
                      ${item.listing.price.toLocaleString('en-US')}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.listing._id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-slate-300 p-6 my-4">
              <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">Your cart is currently empty</h4>
              <p className="text-xs text-slate-500 mb-4">
                Browse our Brutal Age account listings and add items to your cart.
              </p>
              <button
                onClick={onClose}
                className="btn-outline px-4 py-2 text-xs font-bold uppercase"
              >
                Browse Listings
              </button>
            </div>
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-3">
            
            {/* Communication Mode Selector */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-600 mb-1.5 font-heading">
                Choose Checkout Communication Channel *
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 border border-slate-300">
                
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => setCommunicationMode('whatsapp')}
                  className={`py-2 text-[10px] sm:text-[11px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                    communicationMode === 'whatsapp'
                      ? 'bg-emerald-700 text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {/* WeChat */}
                <button
                  type="button"
                  onClick={() => setCommunicationMode('wechat')}
                  className={`py-2 text-[10px] sm:text-[11px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                    communicationMode === 'wechat'
                      ? 'bg-emerald-800 text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WeChat</span>
                </button>

                {/* Line */}
                <button
                  type="button"
                  onClick={() => setCommunicationMode('line')}
                  className={`py-2 text-[10px] sm:text-[11px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                    communicationMode === 'line'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Line</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={() => setCommunicationMode('telegram')}
                  className={`py-2 text-[10px] sm:text-[11px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                    communicationMode === 'telegram'
                      ? 'bg-sky-600 text-white shadow-xs font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </button>

              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Subtotal Price</span>
              <span className="text-2xl font-extrabold text-slate-900 font-heading font-mono-num">
                {formattedSubtotal}
              </span>
            </div>

            {/* Dynamic Checkout Action Button */}
            <button
              onClick={handleCheckoutSubmit}
              className={`w-full py-3.5 text-xs font-extrabold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xs transition-all ${
                communicationMode === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : communicationMode === 'wechat'
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  : communicationMode === 'line'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              {communicationMode === 'whatsapp' && <Phone className="w-4 h-4" />}
              {communicationMode === 'wechat' && (copiedNotification ? <Check className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />)}
              {communicationMode === 'line' && (copiedNotification ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />)}
              {communicationMode === 'telegram' && <Send className="w-4 h-4" />}

              <span>
                {communicationMode === 'whatsapp' && `Proceed to WhatsApp Checkout (${cartItems.length} Items)`}
                {communicationMode === 'wechat' && (copiedNotification || `Proceed to WeChat Checkout (${cartItems.length} Items)`)}
                {communicationMode === 'line' && (copiedNotification || `Proceed to Line Checkout (${cartItems.length} Items)`)}
                {communicationMode === 'telegram' && `Proceed to Telegram Checkout (${cartItems.length} Items)`}
              </span>
            </button>

            <button
              onClick={onClearCart}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold w-full text-center block"
            >
              Clear Cart Items
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
