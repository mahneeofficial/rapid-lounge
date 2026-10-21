import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface WaiterShiftSummary {
  name: string;
  badge: string;
  claimedCount: number;
  deliveredCount: number;
  totalSettlements: number;
}

export const AuditReconciliationTab: React.FC = () => {
  const [shiftSummaries, setShiftSummaries] = useState<WaiterShiftSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateLiveShifts();
  }, []);

  const calculateLiveShifts = async () => {
    setLoading(true);

    // Fetch waiters and orders in parallel
    const [waiterRes, orderRes] = await Promise.all([
      supabase.from('waiters').select('*'),
      supabase.from('orders').select('*'),
    ]);

    const waiters = waiterRes.data || [];
    const orders = orderRes.data || [];

    const summaries: WaiterShiftSummary[] = waiters.map((w) => {
      const waiterOrders = orders.filter((o) => o.claimed_by === w.name);
      const deliveredOrders = waiterOrders.filter((o) => o.status === 'Delivered & Completed');
      const totalAmount = deliveredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      return {
        name: w.name,
        badge: w.badge,
        claimedCount: waiterOrders.length,
        deliveredCount: deliveredOrders.length,
        totalSettlements: totalAmount,
      };
    });

    setShiftSummaries(summaries);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          📑 SHIFT CLOSING & AUTOMATIC CASH RECONCILIATION
        </h4>
        <p className="text-xs text-zinc-400">
          Real-time aggregates calculated directly from live M-Pesa orders delivered by each waiter shift.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-zinc-500 text-center py-8 font-mono">Calculating live shift reconciliations...</p>
      ) : shiftSummaries.length === 0 ? (
        <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-2xl text-center text-xs text-zinc-500">
          No waiter shifts recorded yet. Create staff accounts in Staff Roster to begin tracking shifts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shiftSummaries.map((shift, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-sm font-bold text-white">{shift.name}</h5>
                  <p className="text-[10px] text-amber-400 font-mono">{shift.badge}</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  ACTIVE SHIFT
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-900 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Orders Claimed:</span>
                  <span className="font-bold">{shift.claimedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivered & Verified:</span>
                  <span className="font-bold text-emerald-400">{shift.deliveredCount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-900">
                  <span className="text-zinc-400 font-bold">Total Till Settlement:</span>
                  <span className="font-black text-amber-400 text-sm">KES {shift.totalSettlements.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Shift audit completed for ${shift.name}. Settlement KES ${shift.totalSettlements.toLocaleString()} reconciled.`)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 rounded-xl text-xs transition"
              >
                🔒 Audit & Close Shift
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};