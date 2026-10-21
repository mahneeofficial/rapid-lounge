import React, { useState } from 'react';

interface TableUnit {
  id: string;
  name: string;
  zone?: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
  status: string;
}

interface UnitGridProps {
  units: TableUnit[];
  selectedUnit: string;
  onSelectUnit: (name: string, price: number, maxSeats: number) => void;
  typeLabel: string;
}

export const UnitGrid: React.FC<UnitGridProps> = ({
  units,
  selectedUnit,
  onSelectUnit,
  typeLabel,
}) => {
  const [activeZone, setActiveZone] = useState<string>('ALL');

  // Extract unique zones for filtering
  const zones = ['ALL', ...Array.from(new Set(units.map((u) => u.zone).filter(Boolean)))];

  const filteredUnits = activeZone === 'ALL' 
    ? units 
    : units.filter((u) => u.zone === activeZone);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <label className="text-xs font-semibold text-amber-500 tracking-wider flex items-center gap-1.5">
          <span>🪑</span> SELECT EXACT {typeLabel.toUpperCase()} (SGR-STYLE SEAT ASSIGNMENT)
        </label>
        <span className="text-[10px] text-zinc-500">
          Click any available table to inspect seat capacity & price
        </span>
      </div>

      {/* Zone Filter Chips */}
      {zones.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {zones.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setActiveZone(zone || 'ALL')}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition ${
                activeZone === zone
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              {zone === 'ALL' ? 'All Sections' : zone}
            </button>
          ))}
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filteredUnits.map((unit) => {
          const isSelected = selectedUnit === unit.name;
          const isFullyBooked = unit.status === 'booked' || unit.bookedSeats >= unit.totalSeats;
          const seatsFree = unit.totalSeats - unit.bookedSeats;

          return (
            <button
              key={unit.id}
              type="button"
              disabled={isFullyBooked}
              onClick={() => onSelectUnit(unit.name, unit.price, unit.totalSeats)}
              className={`relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isFullyBooked
                  ? 'bg-zinc-950/50 border-zinc-900 opacity-40 cursor-not-allowed'
                  : isSelected
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/5'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-1">
                  <h4 className="text-xs font-bold text-white leading-tight">{unit.name}</h4>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap ${
                      isFullyBooked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isFullyBooked ? 'FULL' : `${seatsFree} Free`}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Capacity: <span className="text-zinc-300 font-semibold">{unit.totalSeats} chairs</span>
                </p>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-zinc-900">
                <span className="text-[10px] text-zinc-400">Deposit:</span>
                <span className="text-xs font-black text-amber-400">
                  KES {unit.price.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};