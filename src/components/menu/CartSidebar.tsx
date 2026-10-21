import React from 'react';

interface CartSidebarProps {
  cart: any[];
  onRemove: (name: string) => void;
  tableNumber: string;
  setTableNumber: (t: string) => void;
  customerName: string;
  setCustomerName: (n: string) => void;
  customerPhone: string;
  setCustomerPhone: (p: string) => void;
  totalPayable: number;
  currencySymbol: Record<string, string>;
  currency: string;
  convertPrice: (p: number) => number;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  onRemove,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  totalPayable,
  currencySymbol,
  currency,
  convertPrice,
  onCheckout,
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl sticky top-24 space-y-6 shadow-2xl">
      <div>
        <h3 className="text-lg font-serif font-bold text-white">Digital Waiter Cart</h3>
        <p className="text-xs text-zinc-400">Direct M-Pesa Checkout (Till 1815773)</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-400 font-medium">Select Table / Seat</label>
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
        >
          <option value="Table MAIN-01">Table MAIN-01</option>
          <option value="Table DJ-01">Table DJ-01</option>
          <option value="VIP Booth A">VIP Booth A</option>
          <option value="Walk-in Counter">Walk-in Counter</option>
        </select>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Your Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
        />
        <input
          type="tel"
          placeholder="M-Pesa Phone (e.g. 0712345678)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-2"
        />
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto divide-y divide-zinc-800">
        {cart.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-4">Cart is empty.</p>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="pt-3 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">{item.name}</p>
                <p className="text-zinc-400">Qty: {item.qty} x KES {item.price.toLocaleString()}</p>
              </div>
              <button onClick={() => onRemove(item.name)} className="text-red-400 font-bold px-2 py-1">✕</button>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-zinc-800 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Total:</span>
          <span className="font-black text-amber-400 text-lg">
            {currencySymbol[currency]} {convertPrice(totalPayable).toLocaleString()}
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className={`w-full font-bold py-3.5 rounded-xl text-xs transition ${
            cart.length === 0 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-black'
          }`}
        >
          Pay via M-Pesa (Till 1815773)
        </button>
      </div>
    </div>
  );
};