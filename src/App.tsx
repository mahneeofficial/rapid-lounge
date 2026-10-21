import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { EventsSection } from './components/EventsSection';
import { VipBooking } from './components/VipBooking';
import { ManagerModal } from './components/ManagerModal';
import { WaiterApp } from './components/waiter/WaiterApp';
import { LiveStreamModal } from './components/LiveStreamModal';
import { LegalModal } from './components/LegalModal';
import { NotFound404 } from './components/admin/NotFound404';
import { CookieBanner } from './components/ui/CookieBanner';

const SECRET_ADMIN_HASH = '#rl-portal-v829';
const SECRET_WAITER_HASH = '#rl-floor-ops-v901';

export default function App() {
  const [vibeStatus, setVibeStatus] = useState("🔥 Packed & Lit - Doors Open!");
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'events' | 'vip'>('home');
  const [cart, setCart] = useState<{ name: string; price: number; qty: number; image_url?: string }[]>(y => []);

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showWaiterApp, setShowWaiterApp] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);
  const [is404, setIs404] = useState(false);

  const addToCart = (name: string, price: number, image_url?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name, price, qty: 1, image_url }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing && existing.qty > 1) {
        return prev.map((item) =>
          item.name === name ? { ...item, qty: item.qty - 1 } : item
        );
      }
      return prev.filter((item) => item.name !== name);
    });
  };

  // Keep route active on page refresh & check secret hashes
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;

      if (currentHash === SECRET_ADMIN_HASH) {
        setIs404(false);
        setShowWaiterApp(false);
        setShowManagerModal(true);
      } else if (currentHash === SECRET_WAITER_HASH) {
        setIs404(false);
        setShowManagerManagerModal?: boolean;
        setShowManagerModal(false);
        setShowWaiterApp(true);
      } else if (
        currentHash === '#admin' || 
        currentHash === '#manager' || 
        currentHash === '#login' ||
        currentHash === '#waiter' ||
        currentHash === '#staff'
      ) {
        setIs404(true);
        setShowManagerModal(false);
        setShowWaiterApp(false);
      } else {
        setIs404(false);
        setShowManagerModal(false);
        setShowWaiterApp(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950 flex flex-col justify-between">
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          cartCount={cartCount}
          vibeStatus={vibeStatus} 
          onOpenLiveModal={() => setShowLiveModal(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {is404 ? (
            <NotFound404 
              onBackHome={() => { 
                window.location.hash = ''; 
                setIs404(false); 
                setActiveTab('home'); 
              }} 
            />
          ) : (
            <>
              {activeTab === 'home' && <Hero setActiveTab={setActiveTab} />}
              {activeTab === 'menu' && (
                <MenuSection 
                  cart={cart} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              )}
              {activeTab === 'events' && <EventsSection setActiveTab={setActiveTab} />}
              {activeTab === 'vip' && (
                <VipBooking 
                  cart={cart} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="border-t border-zinc-900 bg-zinc-950/80 mt-20 py-8 px-6 text-center text-xs text-zinc-500 space-y-3">
        <p>© 2026 Rapid Lounge Voi. All Rights Reserved. Built for Taita Taveta County Nightlife & Tourism.</p>
        <div className="flex justify-center items-center gap-6 text-zinc-400 font-semibold">
          <button onClick={() => setLegalType('privacy')} className="hover:text-amber-400 transition">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => setLegalType('terms')} className="hover:text-amber-400 transition">
            Terms & Conditions
          </button>
        </div>
      </footer>

      {/* Compliance Cookie Banner */}
      <CookieBanner />

      {/* Modals & Portals */}
      <ManagerModal 
        showManagerModal={showManagerModal} 
        setShowManagerModal={setShowManagerModal} 
        setVibeStatus={setVibeStatus} 
      />

      <WaiterApp 
        isOpen={showWaiterApp} 
        onClose={() => { window.location.hash = ''; setShowWaiterApp(false); }} 
      />

      <LiveStreamModal 
        isOpen={showLiveModal} 
        onClose={() => setShowLiveModal(false)} 
      />

      <LegalModal 
        type={legalType} 
        onClose={() => setLegalType(null)} 
      />
    </div>
  );
}