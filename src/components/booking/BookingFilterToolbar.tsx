import React from 'react';

interface BookingFilterToolbarProps {
  selectedCategory: 'all' | 'table' | 'room';
  setSelectedCategory: (cat: 'all' | 'table' | 'room') => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  zones: string[];
}

export const BookingFilterToolbar: React.FC<BookingFilterToolbarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedZone,
  setSelectedZone,
  searchQuery,
  setSearchQuery,
  zones,
}) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all' ? 'bg-amber-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedCategory('table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'table' ? 'bg-amber-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
            }`}
          >
            🍸 Tables & Booths
          </button>
          <button
            onClick={() => setSelectedCategory('room')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'room' ? 'bg-amber-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
            }`}
          >
            🛏️ Overnight Rooms
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search table DJ-01, VIP, Suite..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 max-w-xs w-full font-mono"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-900">
        <span className="text-[10px] text-zinc-500 uppercase font-mono py-1 mr-1">Zone Filter:</span>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition ${
              selectedZone === zone
                ? 'bg-zinc-200 text-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>
    </div>
  );
};