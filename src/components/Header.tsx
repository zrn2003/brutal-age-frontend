import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, X, User, LogOut } from 'lucide-react';
import type { BuyerUser } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  buyerUser: BuyerUser | null;
  onOpenAuthModal: () => void;
  onBuyerLogout: () => void;
  cartItemCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  buyerUser,
  onOpenAuthModal,
  onBuyerLogout,
  cartItemCount,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 font-heading">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white flex items-center justify-center font-black text-sm sm:text-lg tracking-tight font-heading">
              AB
            </div>
            <div>
              <span className="text-base sm:text-2xl font-black tracking-tight font-heading text-slate-900 block leading-none">
                BRUTAL AGE
              </span>
              <span className="block text-[8px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 font-heading mt-0.5">
                AB's Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Brutal Age accounts by Leadership level, Power..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-none pl-9 pr-8 py-2.5 border border-slate-300 focus:outline-none focus:border-slate-900 font-bold font-heading"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Cart & Buyer Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="btn-indigo px-3 py-2 text-xs font-extrabold uppercase flex items-center gap-1.5 tracking-wider transition-all min-h-[38px] shadow-xs font-heading"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              <span className="font-heading text-[11px] sm:text-xs">CART</span>
              <span className="bg-white text-indigo-700 px-1.5 py-0.5 text-[10px] font-black font-mono-num">
                {cartItemCount}
              </span>
            </button>

            {/* Desktop Auth Controls */}
            <div className="hidden sm:flex items-center gap-2">
              {buyerUser ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <span className="block text-xs font-extrabold text-slate-900 font-heading">{buyerUser.name}</span>
                    <span className="block text-[10px] text-emerald-600 font-bold font-heading">Buyer Logged In</span>
                  </div>
                  <button
                    onClick={onBuyerLogout}
                    className="p-1.5 border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 flex items-center gap-1 text-xs font-bold font-heading px-2.5"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-heading">
                  <button
                    onClick={onOpenAuthModal}
                    className="px-3 py-2 border border-slate-300 text-xs font-extrabold text-slate-800 hover:bg-slate-50 font-heading"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onOpenAuthModal}
                    className="btn-indigo px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider font-heading"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Account / Search Toggle */}
            <button
              onClick={() => {
                if (buyerUser) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  onOpenAuthModal();
                }
              }}
              className="sm:hidden p-2 text-slate-800 border border-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center bg-slate-50"
              title={buyerUser ? buyerUser.name : 'Buyer Sign In'}
            >
              <User className="w-4 h-4 text-slate-700" />
            </button>

            {/* Mobile Search Bar Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-slate-800 border border-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-200 p-3 space-y-3 animate-in fade-in font-heading">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts (Leadership level, Power)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-none pl-9 pr-3 py-2.5 border border-slate-300 font-bold font-heading"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 font-heading">
            {buyerUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 font-heading block">{buyerUser.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Buyer Account Logged In</span>
                </div>
                <button
                  onClick={() => { onBuyerLogout(); setMobileMenuOpen(false); }}
                  className="text-xs font-extrabold text-red-600 flex items-center gap-1 font-heading border border-red-200 bg-red-50 px-2.5 py-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                className="btn-indigo w-full py-2.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 font-heading"
              >
                <User className="w-4 h-4" />
                <span>Buyer Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
