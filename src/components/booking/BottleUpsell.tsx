import React, { useState } from 'react';

interface BottleItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

interface BottleUpsellProps {
  cart: CartItem[];
  onAddToCart: (name: string, price: number) => void;
  onRemoveFromCart: (name: string) => void;
}

const PREMIUM_BOTTLES: BottleItem[] = [
  { id: 'b1', name: 'Hennessy VSOP (750ml)', category: 'Cognac', price: 8500 },
  { id: 'b2', name: 'Johnnie Walker Black Label', category: 'Whisky', price: 6500 },
  { id: 'b3', name: 'Moët & Chandon Brut', category: 'Champagne', price: 12000 },
  { id: 'b4', name: 'Gilbeys Gin (750ml)', category: 'Gin', price: 3000 },
  { id: 'b5', name: 'Red Bull Energy Pack (4x)', category: 'Mixer', price: 1600 },
  { id: 'b6', name: 'Schweppes Tonic Water (6x)', category: 'Mixer', price: 1200 },
];

export const BottleUpsell: React.FC<BottleUpsellProps> = ({
  cart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'lowToHigh' | 'highToLow'>('default');

  const filteredBottles = PREMIUM_BOTTLES.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  const sortedBottles = [...filteredBottles].sort((a, b) => {
    if (sortBy === 'lowToHigh') return a.price - b.price;
    if (sortBy === 'highToLow') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h4 className="text-xs font-semibold text-amber-500 tracking-wider flex items-center gap-1.5">
            <span>🍾</span> VIP BOTTLE SERVICE & MIXER PRE-ORDER (OPTIONAL)
          </h4>
          <p className="text-[10px] text-zinc-500">
            Pre-order drinks to be iced and ready at your table upon arrival.
          </p>
        </div>
        {cart.length > 0 && (
          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
            {cart.reduce((sum, item) => sum + item.qty, 0)} Selected
          </span>
        )}
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 bg-zinc-950 p-2.5 rounded-2xl border border-zinc-800">
        <div className="flex flex-wrap gap-1">
          {['All', 'Cognac', 'Whisky', 'Champagne', 'Gin', 'Mixer'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-lg focus:outline-none"
        >
          <option value="default">Default Order</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Bottle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedBottles.map((bottle) => {
          const cartItem = cart.find((i) => i.name === bottle.name);
          const qty = cartItem ? cartItem.qty : 0;

          return (
            <div
              key={bottle.id}
              className={`p-3.5 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                qty > 0
                  ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                    {bottle.category}
                  </span>
                  <h5 className="text-xs font-bold text-white mt-0.5">{bottle.name}</h5>
                </div>
                <span className="text-xs font-black text-amber-400 whitespace-nowrap">
                  KES {bottle.price.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => onAddToCart(bottle.name, bottle.price)}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-700 hover:border-amber-500/50 text-xs font-bold py-1.5 rounded-xl transition"
                  >
                    + Add to Reservation
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(bottle.name)}
                      className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-zinc-700 rounded-xl font-bold flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white">
                      {qty} {qty === 1 ? 'Bottle' : 'Bottles'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddToCart(bottle.name, bottle.price)}
                      className="w-8 h-8 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};