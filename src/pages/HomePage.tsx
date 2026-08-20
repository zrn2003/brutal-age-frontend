import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AutoSlider } from '../components/AutoSlider';
import { TrustStats } from '../components/TrustStats';
import { ListingsSection } from '../components/ListingsSection';
import { CartDrawer } from '../components/CartDrawer';
import { BuyerAuthModal } from '../components/BuyerAuthModal';
import { CustomRequirementModal } from '../components/CustomRequirementModal';
import { Footer } from '../components/Footer';
import { mockListings } from '../data/mockListings';
import { useToast } from '../context/ToastContext';
import { getApiBaseUrl } from '../config/api';
import type { Listing, BuyerUser, CartItem } from '../types';

export const HomePage: React.FC = () => {
  const toast = useToast();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Buyer Auth State
  const [buyerUser, setBuyerUser] = useState<BuyerUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [promptMessage, setPromptMessage] = useState<string>('');

  // Custom Requirement Modal State
  const [customReqModalOpen, setCustomReqModalOpen] = useState<boolean>(false);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Track website visit for analytics
    const apiBase = getApiBaseUrl();
    fetch(`${apiBase}/analytics/visit`, { method: 'POST' }).catch(() => {});

    // 2. Load saved buyer session
    const savedBuyer = localStorage.getItem('buyerSession');
    if (savedBuyer) {
      try {
        setBuyerUser(JSON.parse(savedBuyer));
      } catch (err) {}
    }

    // 3. Load saved cart items
    let initialCartItems: CartItem[] = [];
    const savedCart = localStorage.getItem('cartSession');
    if (savedCart) {
      try {
        initialCartItems = JSON.parse(savedCart);
        setCartItems(initialCartItems);
      } catch (err) {}
    }

    // 4. Fetch live API listings & Sync/Validate Cart items against MongoDB
    fetch(`${apiBase}/listings`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Backend offline');
      })
      .then((data: Listing[]) => {
        if (Array.isArray(data)) {
          setListings(data);

          // Cross-validate cart items against live available listings
          if (initialCartItems.length > 0) {
            const validCartItems = initialCartItems.filter((item) => {
              const liveListing = data.find((l) => l._id === item.listing._id);
              // Keep only if listing exists in DB and is marked Available
              return Boolean(liveListing && liveListing.status === 'Available');
            });

            if (validCartItems.length !== initialCartItems.length) {
              const removedCount = initialCartItems.length - validCartItems.length;
              setCartItems(validCartItems);
              localStorage.setItem('cartSession', JSON.stringify(validCartItems));
              toast.warning(
                'Cart Items Updated',
                `${removedCount} item(s) in your cart were automatically removed because they were deleted or sold by store admin.`
              );
            }
          }
        }
      })
      .catch((err) => {
        console.log('API error fetching listings:', err.message);
      });
  }, []);

  const saveCartToStorage = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cartSession', JSON.stringify(items));
  };

  const handleAddToCart = (listing: Listing) => {
    // Prevent duplicate entries
    const exists = cartItems.some((item) => item.listing._id === listing._id);
    if (!exists) {
      const updated = [...cartItems, { listing, addedAt: new Date().toISOString() }];
      saveCartToStorage(updated);
      toast.success('Account Added to Cart', `Added "${listing.title}" ($${listing.price}) to your cart.`);
    } else {
      toast.info('Item Already in Cart', `"${listing.title}" is already in your shopping cart.`);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (listingId: string) => {
    const item = cartItems.find((i) => i.listing._id === listingId);
    const updated = cartItems.filter((i) => i.listing._id !== listingId);
    saveCartToStorage(updated);
    if (item) {
      toast.info('Item Removed', `Removed "${item.listing.title}" from cart.`);
    }
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
    toast.info('Cart Cleared', 'All items have been removed from your shopping cart.');
  };

  const handleRequireLogin = (msg: string) => {
    setPromptMessage(msg);
    setAuthModalOpen(true);
    toast.warning('Buyer Login Required', 'Please sign in or register to add items to your cart.');
  };

  const handleBuyerLogout = () => {
    localStorage.removeItem('buyerSession');
    setBuyerUser(null);
    toast.info('Buyer Signed Out', 'You have been logged out of your buyer session.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white font-heading">
      
      {/* 1. Header with Cart count & Buyer Auth */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        buyerUser={buyerUser}
        onOpenAuthModal={() => { setPromptMessage(''); setAuthModalOpen(true); }}
        onBuyerLogout={handleBuyerLogout}
        cartItemCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 space-y-2 font-heading">
        {/* 2. Hero Image Banner */}
        <AutoSlider />

        {/* 3. Metrics & Trust Bar */}
        <TrustStats />

        {/* 4. Brutal Age Account Listings */}
        <ListingsSection
          listings={listings}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          buyerUser={buyerUser}
          onAddToCart={handleAddToCart}
          onRequireLogin={handleRequireLogin}
        />
      </main>

      {/* 5. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        buyerUser={buyerUser}
      />

      {/* 6. Buyer Auth Modal (Sign In / Register) */}
      <BuyerAuthModal
        isOpen={authModalOpen}
        onClose={() => { setAuthModalOpen(false); setPromptMessage(''); }}
        onLoginSuccess={(user) => {
          setBuyerUser(user);
          toast.success('Welcome Back!', `Signed in as buyer: ${user.name}`);
        }}
        customPromptMessage={promptMessage}
      />

      {/* 7. Custom Requirement Request Modal */}
      <CustomRequirementModal
        isOpen={customReqModalOpen}
        onClose={() => setCustomReqModalOpen(false)}
        buyerUser={buyerUser}
      />

      {/* 8. Footer with Custom Requirement link */}
      <Footer onOpenCustomRequirementModal={() => setCustomReqModalOpen(true)} />

    </div>
  );
};
