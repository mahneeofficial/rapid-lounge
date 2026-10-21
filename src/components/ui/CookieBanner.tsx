import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rl_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('rl_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('rl_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-zinc-950/95 border-t border-zinc-800 p-6 shadow-2xl backdrop-blur-xl text-zinc-300 text-xs animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1 max-w-4xl">
          <h4 className="font-serif font-black text-white text-base tracking-wide flex items-center gap-2">
            <span>🍪</span> We use cookies and device storage technologies.
          </h4>
          <p className="text-zinc-400 leading-relaxed text-[11px]">
            Rapid Lounge Voi uses essential cookies and local browser storage to process table reservations, store your digital waiter cart, verify live M-Pesa Till payments, and manage entrance QR pass credentials under the Kenya Data Protection Act.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleRejectAll}
            className="w-full sm:w-auto border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-bold px-6 py-3 rounded-xl transition text-xs font-mono"
          >
            REJECT NON-ESSENTIAL
          </button>
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-8 py-3 rounded-xl transition text-xs shadow-lg shadow-amber-500/20"
          >
            ACCEPT ALL COOKIES
          </button>
        </div>
      </div>
    </div>
  );
};