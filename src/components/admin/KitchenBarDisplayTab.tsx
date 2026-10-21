import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export const KitchenBarDisplayTab: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 4000); // Live polling every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLiveOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const markOrderReady = async (id: number) => {
    await supabase
      .from('orders')
      .update({ status: 'Ready for Pickup / Server' })
      .eq('id', id);

    fetchLiveOrders();
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          🍳 KITCHEN & BAR DISPLAY SYSTEM (KDS)
        </h4>
        <p className="text-xs text-zinc-400">
          Live kitchen/bar screen for bartenders and grill masters to fulfill customer drink and food dispatches.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-zinc-500 font-mono text-center py-8">Loading live order queue...</p>
      ) : orders.length === 0 ? (
        <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-500 font-mono">
          No pending orders in the kitchen or bar queue.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const isReady = order.status === 'Ready for Pickup / Server' || order.status === 'Delivered & Completed';

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl border space-y-4 transition ${
                  isReady
                    ? 'bg-zinc-950/60 border-zinc-800 opacity-70'
                    : 'bg-zinc-950 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      {order.ticket_code}
                    </span>
                    <h5 className="font-bold text-white text-sm mt-1">{order.unit_booked}</h5>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{order.time || 'Live'}</span>
                </div>

                <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 space-y-1">
                  <p className="font-semibold text-amber-400">Customer: {order.customer_name}</p>
                  <p className="text-[11px] text-zinc-400">Phone: {order.phone}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                  <span
                    className={`text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-lg ${
                      isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                    }`}
                  >
                    {order.status || 'PREPARING'}
                  </span>

                  {!isReady && (
                    <button
                      onClick={() => markOrderReady(order.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 rounded-xl text-xs transition"
                    >
                      ✓ Mark Ready
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};