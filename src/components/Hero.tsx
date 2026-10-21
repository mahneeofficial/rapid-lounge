import React from 'react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <div className="relative overflow-hidden py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-full shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-300 uppercase">
              LIVE STATUS: <span className="text-amber-400 font-bold">Doors Open • Kaloleni Main Road, Voi</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Voi's Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">Nightlife & Social</span> Hub
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Direct M-Pesa table reservations, digital waiter drink dispatches, and executive overnight stays in Voi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => setActiveTab('booking')}
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-extrabold px-8 py-4 rounded-2xl text-sm transition shadow-xl shadow-amber-500/20"
            >
              Reserve VIP Table or Room →
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold px-8 py-4 rounded-2xl text-sm transition"
            >
              Browse Digital Menu
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-xs">
            <div>
              <p className="font-black text-amber-400 font-mono text-sm">Till 1815773</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">M-Pesa Direct Verification</p>
            </div>
            <div>
              <p className="font-black text-white font-mono text-sm">QR Code</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Instant Bouncer Scan</p>
            </div>
            <div>
              <p className="font-black text-white font-mono text-sm">24/7</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Live Floor Dispatch</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400">VIP Area</span>
                <h3 className="text-base font-bold text-white">DJ Deck Zone Seating</h3>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono font-bold">
                Available
              </span>
            </div>

            <div className="w-full h-48 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center text-center p-4">
              <div className="space-y-2">
                <span className="text-3xl">🍸</span>
                <p className="text-xs font-bold text-white">DJ Deck High Tables</p>
                <p className="text-[11px] text-zinc-400">Front-row sound experience with table service</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-[10px] text-zinc-500 block">Pricing</span>
                <span className="text-sm font-black text-amber-400 font-mono">KES 1,000 / seat</span>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Book Table
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};