import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

export const PassVerifier: React.FC = () => {
  const [verifyInput, setVerifyInput] = useState('');
  const [scanAlert, setScanAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    const query = verifyInput.trim().toUpperCase();

    // Query Supabase directly for ticket code
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('ticket_code', query)
      .maybeSingle();

    if (error || !data) {
      setScanAlert({ type: 'danger', message: `🛑 INVALID PASS: Code "${query}" not found in database.` });
    } else if (data.is_redeemed || data.status === 'Delivered & Completed') {
      setScanAlert({
        type: 'danger',
        message: `🛑 FRAUD ALERT: Pass ${data.ticket_code} was ALREADY REDEEMED by ${data.claimed_by || 'Staff'} at ${data.delivered_at || 'earlier shift'}! DO NOT SERVE!`,
      });
    } else {
      setScanAlert({
        type: 'success',
        message: `✅ VALID UNUSED PASS: ${data.ticket_code} for ${data.customer_name} (${data.unit_booked.split('[')[0]})`,
      });
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
        🔍 LIVE PASS RE-USE VERIFIER
      </h4>
      <form onSubmit={handleVerifyCode} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter or scan pass code (e.g. RL-BAR-91204)..."
          value={verifyInput}
          onChange={(e) => setVerifyInput(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap transition"
        >
          Verify Pass Code
        </button>
      </form>

      {scanAlert && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            scanAlert.type === 'danger'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          {scanAlert.message}
        </div>
      )}
    </div>
  );
};