import React from 'react';

interface InventoryUnit {
  id: number;
  unit_id: string;
  name: string;
  category: 'table' | 'room';
  zone: string;
  price: number;
  total_seats: number;
  booked_seats: number;
  status: string;
}

interface InventoryGridProps {
  units: InventoryUnit[];
  loading: boolean;
  selectedUnit: InventoryUnit | null;
  onSelectUnit: (unit: InventoryUnit) => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  units,
  loading,
  selectedUnit,
  onSelectUnit,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
        1. Select Live Available Table or Room
      </h3>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs animate-pulse">
          Querying live table & room inventory from database...
        </div>
      ) : units.length === 0 ? (
        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
          No inventory units configured yet. Manager can add tables/rooms in Admin Portal.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {units.map((unit) => {
            const availableSeats = unit.total_seats - unit.booked_seats;
            const isFullyBooked = availableSeats <= 0 || unit.status === 'booked';
            const isSelected = selectedUnit?.id === unit.id;

            return (
              <div
                key={unit.id}
                onClick={() => !isFullyBooked && onSelectUnit(unit)}
                className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 cursor-pointer ${
                  isFullyBooked
                    ? 'bg-zinc-950 border-zinc-900 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
                      {unit.zone} • {unit.category.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{unit.name}</h4>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isFullyBooked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isFullyBooked ? '🔒 FULLY BOOKED' : `${availableSeats} Seats Available`}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                  <span className="text-sm font-black text-amber-400 font-mono">
                    KES {unit.price.toLocaleString()} {unit.category === 'table' ? '/ seat' : '/ night'}
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">
                    {isSelected ? '✓ Selected' : 'Tap to Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};