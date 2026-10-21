import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { WaiterLogin } from './WaiterLogin';
import { PassVerifier } from './PassVerifier';
import { WaiterOrderFeed } from './WaiterOrderFeed';

interface WaiterSession {
  username: string;
  badge: string;
}

export const WaiterApp: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // Check browser storage on load so refresh doesn't log the waiter out
  const [session, setSession] = useState<WaiterSession | null>(() => {
    const saved = localStorage.getItem('rl_active_waiter_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false });

      if (data) setOrders(data);
    } catch {
      // Offline fallback
    }
  };

  const handleLoginSuccess = (username: string, badge: string) => {
    const sessionData = { username, badge };
    localStorage.setItem('rl_active_waiter_session', JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const handleLogout = () => {
    localStorage.removeItem('rl_active_waiter_session');
    setSession(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-black font-black rounded-xl flex items-center justify-center text-lg">
            🛵
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">WAITER FLOOR DISPATCH</h3>
            <p className="text-[10px] text-zinc-400">Isolated Terminal • Route Preserved</p>
          </div>
        </div>

        {session ? (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
              {session.username} ({session.badge})
            </span>
            <button onClick={handleLogout} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-xl font-bold">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-xl">
            Close
          </button>
        )}
      </div>

      {!session ? (
        <WaiterLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="max-w-2xl mx-auto w-full my-4 space-y-6 flex-1">
          <PassVerifier orders={orders} />
          <WaiterOrderFeed orders={orders} session={session} onRefresh={fetchOrders} />
        </div>
      )}
    </div>
  );
};