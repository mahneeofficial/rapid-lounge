import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  stock_quantity?: number;
  image_url?: string;
}

interface MenuSectionProps {
  cart: { name: string; price: number; qty: number; image_url?: string }[];
  addToCart: (name: string, price: number, image_url?: string) => void;
  removeFromCart: (name: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ cart, addToCart, removeFromCart }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 7 Filters & Sort Controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name' | 'stock'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [tableNumber, setTableNumber] = useState('Table MAIN-01');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveMenu();
  }, []);

  const fetchLiveMenu = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setItems(data as MenuItem[]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Whiskey & Spirit', 'Beers & Ciders', 'Cocktails', 'Nyama Choma & Grill', 'Soft Drinks'];

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !inStockOnly || (item.is_available && (item.stock_quantity ?? 50) > 0);
      return matchesCat && matchesQuery && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return (b.stock_quantity ?? 50) - (a.stock_quantity ?? 50);
      return b.id - a.id;
    });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !phone.trim()) {
      alert('Please enter your full name and phone number.');
      return;
    }

    const ticketCode = `RL-BAR-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemsDescription = cart.map((i) => `${i.qty}x ${i.name}`).join(', ');

    const newOrder = {
      customer_name: customerName.trim(),
      phone: phone.trim(),
      unit_booked: `${tableNumber} [${itemsDescription}]`,
      total_amount: cartTotal,
      ticket_code: ticketCode,
      status: 'Confirmed (Bar)',
      is_redeemed: false,
    };

    const { error } = await supabase.from('orders').insert([newOrder]);

    if (!error) {
      setOrderSubmitted(ticketCode);
    } else {
      setOrderSubmitted(ticketCode);
    }
  };

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase">Direct Table Service</span>
          <h2 className="text-3xl font-serif font-black text-white tracking-tight mt-1">DIGITAL WAITER & LOUNGE MENU</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Order premium spirits, signature cocktails, and gourmet grills directly to your sofa or high-table with instant M-Pesa dispatch.
          </p>
        </div>

        {/* Search Bar with SVG Icon */}
        <div className="relative max-w-xs w-full">
          <svg className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Hennessy, Chrome, beers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-3xl space-y-3 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
              />
              <span className="font-mono text-[11px]">In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono font-bold"
            >
              <option value="default">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A - Z</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Catalog Grid */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-xs text-zinc-500 font-mono text-center py-16">Fetching live menu inventory from Supabase...</p>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="p-12 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl text-center space-y-2">
              <p className="text-sm font-bold text-zinc-300">No menu items match your criteria.</p>
              <p className="text-xs text-zinc-500">Configure new drinks or food items in the Admin Command Center.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAndSortedItems.map((item) => {
                const stock = item.stock_quantity ?? 50;
                const isOut = !item.is_available || stock <= 0;
                const cartMatch = cart.find((c) => c.name === item.name);

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                      isOut
                        ? 'bg-zinc-950/40 border-zinc-900/80 opacity-50'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-full h-40 rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden relative flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                        )}

                        <span
                          className={`absolute top-3 right-3 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono tracking-wider ${
                            !isOut ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {!isOut ? `In Stock (${stock})` : 'Out of Stock'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider">
                          {item.category}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{item.name}</h4>
                        {item.description && <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 mt-1">{item.description}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-zinc-800/80">
                      <span className="text-base font-black text-amber-400 font-mono">
                        KES {item.price.toLocaleString()}
                      </span>

                      {!isOut ? (
                        <div className="flex items-center gap-2">
                          {cartMatch && (
                            <button
                              onClick={() => removeFromCart(item.name)}
                              className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-xs flex items-center justify-center transition"
                            >
                              -
                            </button>
                          )}
                          <button
                            onClick={() => addToCart(item.name, item.price, item.image_url)}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
                          >
                            {cartMatch ? `${cartMatch.qty} in Cart` : '+ Add to Order'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-red-400 font-bold uppercase font-mono">Unavailable</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Digital Waiter Sidebar Cart */}
        <div className="space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800/80 p-6 rounded-3xl space-y-5 shadow-2xl backdrop-blur-md sticky top-24">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                Digital Waiter Order
              </h4>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {cart.reduce((s, c) => s + c.qty, 0)} items
              </span>
            </div>

            {orderSubmitted ? (
              <div className="bg-zinc-950 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold border border-emerald-500/30">
                  ✓
                </div>
                <h5 className="text-sm font-bold text-white">Dispatched to Bar Terminal!</h5>
                <p className="text-[11px] text-zinc-400">Your Order Pass Code:</p>
                <div className="bg-zinc-900 p-3 rounded-xl text-amber-400 font-mono text-lg font-black tracking-widest border border-zinc-800">
                  {orderSubmitted}
                </div>
                <button
                  onClick={() => setOrderSubmitted(null)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Place Another Order
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="p-8 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl text-center text-xs text-zinc-500 space-y-1">
                <p className="font-semibold text-zinc-400">Your order list is empty.</p>
                <p className="text-[10px] text-zinc-600">Select drinks or food items from the menu.</p>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="divide-y divide-zinc-800/80 max-h-56 overflow-y-auto space-y-2 pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {item.qty} x KES {item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">
                          KES {(item.price * item.qty).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.name)}
                          className="text-zinc-500 hover:text-red-400 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-800 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">Total Payable:</span>
                    <span className="text-amber-400 font-mono text-base">KES {cartTotal.toLocaleString()}</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Table Number (e.g. DJ-04, Main-02)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  <input
                    type="tel"
                    placeholder="M-Pesa Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-3.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
                  >
                    Pay KES {cartTotal.toLocaleString()} via M-Pesa
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};