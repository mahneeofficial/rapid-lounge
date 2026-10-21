import React from 'react';

interface InteractiveFloorMapProps {
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
}

export const InteractiveFloorMap: React.FC<InteractiveFloorMapProps> = ({ selectedTable, onSelectTable }) => {
  const tables = [
    { id: 'DJ-01', zone: 'DJ Deck Zone', seats: 4 },
    { id: 'DJ-02', zone: 'DJ Deck Zone', seats: 4 },
    { id: 'DJ-03', zone: 'DJ Deck Zone', seats: 6 },
    { id: 'MAIN-01', zone: 'Main Floor', seats: 4 },
    { id: 'MAIN-02', zone: 'Main Floor', seats: 4 },
    { id: 'MAIN-03', zone: 'Main Floor', seats: 6 },
    { id: 'VIP-A1', zone: 'VIP Booths', seats: 8 },
    { id: 'VIP-A2', zone: 'VIP Booths', seats: 8 },
    { id: 'VERANDAH-01', zone: 'Open-Air Verandah', seats: 4 },
    { id: 'VERANDAH-02', zone: 'Open-Air Verandah', seats: 4 },
    { id: 'SGR-01', zone: 'SGR Transit Corner', seats: 4 },
    { id: 'SUITE-101', zone: 'Overnight Rooms', seats: 2 },
  ];

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 p-6 rounded-3xl space-y-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Visual Venue Blueprint</span>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">SELECT TABLE OR ROOM LOCATION</h4>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
          Click table box to reserve
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map((t) => {
          const isSelected = selectedTable === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTable(t.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-2 ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-400 shadow-xl shadow-amber-500/20 font-bold scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[9px] uppercase tracking-wider font-mono ${isSelected ? 'text-black/80' : 'text-amber-400'}`}>
                  {t.zone}
                </span>
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-black' : 'text-zinc-400'}`}>
                  👥 {t.seats}
                </span>
              </div>
              <h5 className="text-sm font-black font-mono tracking-tight">{t.id}</h5>
            </button>
          );
        })}
      </div>
    </div>
  );
};