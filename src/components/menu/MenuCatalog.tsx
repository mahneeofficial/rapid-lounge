import React from 'react';

interface MenuCatalogProps {
  menuItems: any[];
  loading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
  currency: 'KES' | 'USD' | 'EUR';
  setCurrency: (curr: 'KES' | 'USD' | 'EUR') => void;
  onAddToCart: (name: string, price: number) => void;
  convertPrice: (price: number) => number;
  currencySymbol: Record<string, string>;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  menuItems,
  loading,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  currency,
  setCurrency,
  onAddToCart,
  convertPrice,
  currencySymbol,
}) => {
  const categories = ['All', ...Array.from(new Set(menuItems.map((i) => i.category)))];

  const filtered = menuItems.filter((i) => selectedCategory === 'All' || i.category === selectedCategory);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'lowToHigh') return a.price - b.price;
    if (sortBy === 'highToLow') return b.price - a.price;
    if (sortBy === 'aToZ') return a.name.localeCompare(b.name);
    if (sortBy === 'zToA') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat ? 'bg-amber-500 text-black' : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-500"
          >
            <option value="default">Featured</option>
            <option value="aToZ">Name: A to Z</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs animate-pulse">Loading menu...</div>
      ) : sorted.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 text-xs">No items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">{item.category}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                <span className="text-sm font-black text-amber-400 font-mono">
                  {currencySymbol[currency]} {convertPrice(item.price).toLocaleString()}
                </span>
                <button
                  onClick={() => onAddToCart(item.name, item.price)}
                  className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-400 hover:text-black px-3 py-1.5 rounded-xl text-xs font-bold transition"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};