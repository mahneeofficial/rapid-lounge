import React, { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, cartCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu & Prices' },
    { id: 'vibe', label: 'Weekly Vibe' },
    { id: 'booking', label: 'VIP Booking' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black font-serif font-black text-xl tracking-tighter">
            RL
          </div>
          <div>
            <h1 className="font-serif font-black text-white text-base sm:text-lg tracking-wide flex items-center gap-2">
              RAPID LOUNGE <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono font-bold">VOI</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-mono tracking-tight hidden sm:block">
              Ultimate Nightlife & Entertainment Hub
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 border border-zinc-800/80 p-1.5 rounded-2xl">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Cart Action */}
        <div className="flex items-center gap-3">
          {cartCount > 0 && (
            <button
              onClick={() => setActiveTab('menu')}
              className="relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-2 transition"
            >
              <span>🛒 Cart</span>
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-black text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-zinc-300"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold ${
                activeTab === link.id ? 'bg-amber-500 text-black' : 'text-zinc-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};