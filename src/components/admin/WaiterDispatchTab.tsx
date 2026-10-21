import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { CustomModal } from '../ui/CustomModal';

interface Waiter {
  id: number;
  name: string;
  badge: string;
  pin: string;
  status: string;
  is_online: boolean;
  is_blocked: boolean;
  last_seen: string;
}

export const WaiterDispatchTab: React.FC = () => {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<{ id: number; action: 'delete' | 'block' } | null>(null);

  useEffect(() => {
    fetchWaiters();
    const interval = setInterval(fetchWaiters, 5000); // Poll presence every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchWaiters = async () => {
    const { data } = await supabase.from('waiters').select('*').order('id', { ascending: false });
    if (data) setWaiters(data as Waiter[]);
  };

  const formatLastSeen = (lastSeenISO: string, isOnline: boolean) => {
    if (isOnline) return '🟢 Active Now';
    if (!lastSeenISO) return '🔴 Inactive (Offline)';

    const diffMs = Date.now() - new Date(lastSeenISO).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '🔴 Inactive (Just now)';
    if (diffMins < 60) return `🔴 Last seen ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `🔴 Last seen ${diffHours}h ago`;
  };

  const handleCreateWaiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pin.trim()) return;

    await supabase.from('waiters').insert([{
      name: name.trim(),
      badge: badge.trim() || `Badge #${Math.floor(10 + Math.random() * 90)}`,
      pin: pin.trim(),
      status: 'Active',
      is_online: false,
      is_blocked: false,
    }]);

    setName('');
    setBadge('');
    setPin('');
    fetchWaiters();
  };

  const toggleBlockStatus = async (id: number, currentBlocked: boolean) => {
    await supabase.from('waiters').update({
      is_blocked: !currentBlocked,
      status: !currentBlocked ? 'Blocked' : 'Active',
    }).eq('id', id);
    setActiveModal(null);
    fetchWaiters();
  };

  const deleteWaiter = async (id: number) => {
    await supabase.from('waiters').delete().eq('id', id);
    setActiveModal(null);
    fetchWaiters();
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          👔 STAFF ROSTER & LIVE PRESENCE MONITORING
        </h4>

        <form onSubmit={handleCreateWaiter} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Waiter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Badge #"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Login PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-xl text-xs transition">
            + Create Waiter Account
          </button>
        </form>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">REGISTERED STAFF ({waiters.length})</h5>

        <div className="divide-y divide-zinc-800">
          {waiters.map((waiter) => (
            <div key={waiter.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h6 className="font-bold text-white">{waiter.name}</h6>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                    {formatLastSeen(waiter.last_seen, waiter.is_online)}
                  </span>
                </div>
                <p className="text-[10px] text-amber-400 font-mono mt-0.5">{waiter.badge} • PIN: {waiter.pin}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModal({ id: waiter.id, action: 'block' })}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                    waiter.is_blocked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {waiter.is_blocked ? '🔒 BLOCKED (No Access)' : '✅ ACTIVE'}
                </button>
                <button
                  onClick={() => setActiveModal({ id: waiter.id, action: 'delete' })}
                  className="text-zinc-500 hover:text-red-400 text-xs px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Modal */}
      {activeModal && (
        <CustomModal
          isOpen={true}
          type="confirm"
          title={activeModal.action === 'delete' ? 'Delete Staff Account' : 'Toggle Staff Access'}
          message={
            activeModal.action === 'delete'
              ? 'Are you sure you want to permanently delete this waiter account?'
              : 'Blocking this waiter will immediately invalidate their active terminal session.'
          }
          onConfirm={() => {
            const target = waiters.find((w) => w.id === activeModal.id);
            if (activeModal.action === 'delete') {
              deleteWaiter(activeModal.id);
            } else if (target) {
              toggleBlockStatus(activeModal.id, target.is_blocked);
            }
          }}
          onCancel={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};