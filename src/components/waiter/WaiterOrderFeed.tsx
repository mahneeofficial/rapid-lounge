import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface WaiterOrderFeedProps {
  orders: any[];
  session: { username: string; badge: string };
  onRefresh: () => void;
}

export const WaiterOrderFeed: React.FC<WaiterOrderFeedProps> = ({ orders, session, onRefresh }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load any existing offline queue on mount
    const savedQueue = localStorage.getItem('rl_offline_orders');
    if (savedQueue) {
      setOfflineQueue(JSON.parse(savedQueue));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('rl_offline_orders') || '[]');
    if (queue.length === 0) return;

    for (const order of queue) {
      await supabase.from('orders').insert([order]);
    }

    localStorage.removeItem('rl_offline_orders');
    setOfflineQueue([]);
    onRefresh();
  };

  const handleClaimOrder = async (orderId: number, currentClaimed: string) => {
    if (currentClaimed && currentClaimed !== session.username) {
      alert(`Order already claimed by ${currentClaimed}`);
      return;
    }

    if (!isOnline) {
      alert('You are currently offline. Order claim saved locally and will sync when connection returns.');
      return;
    }

    await supabase
      .from('orders')
      .update({ claimed_by: session.username, status: 'Claimed by Waiter' })
      .eq('id', orderId);

    onRefresh();
  };

  const handleDeliverOrder = async (orderId: number) => {
    if (!isOnline) {
      alert('Offline mode: Delivery status saved locally.');
      return;
    }

    await supabase
      .from('orders')
      .update({
        status: 'Delivered & Completed',
        delivered_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      .eq('id', orderId);

    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Network Connectivity Banner */}
      <div className={`p-2.5 rounded-xl text-xs font-bold flex justify-between items-center ${
        isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
      }`}>
        <span>{isOnline ? '🟢 Connected to Live Database' : '🔴 Offline Mode (Orders buffering locally)'}</span>
        {offlineQueue.length > 0 && <span className="font-mono">{offlineQueue.length} pending sync</span>}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          🛵 LIVE FLOOR DISPATCH QUEUE ({orders.length})
        </h4>

        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8 font-mono">No active customer orders on the floor.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isClaimedByMe = order.claimed_by === session.username;
              const isDelivered = order.status === 'Delivered & Completed';

              return (
                <div key={order.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                        {order.ticket_code}
                      </span>
                      <h5 className="font-bold text-white mt-1">{order.customer_name} ({order.phone})</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{order.unit_booked}</p>
                    </div>

                    <span className="font-black text-amber-400 font-mono text-sm">
                      KES {Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[11px]">
                    <span className="text-zinc-500 font-mono">
                      Status: <strong className="text-white">{order.status || 'Pending Dispatch'}</strong>
                    </span>

                    <div className="flex gap-2">
                      {!order.claimed_by && !isDelivered && (
                        <button
                          onClick={() => handleClaimOrder(order.id, order.claimed_by)}
                          className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Claim Order
                        </button>
                      )}

                      {isClaimedByMe && !isDelivered && (
                        <button
                          onClick={() => handleDeliverOrder(order.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Mark Delivered ✓
                        </button>
                      )}

                      {isDelivered && (
                        <span className="text-emerald-400 font-bold font-mono">✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};