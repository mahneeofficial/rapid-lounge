import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export const LiveSettingsTab: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lounge_settings')
      .select('setting_value')
      .eq('setting_key', 'is_live_active')
      .single();

    if (data) {
      setIsLive(data.setting_value === 'true');
    }
    setLoading(false);
  };

  const toggleLiveStatus = async () => {
    const newValue = !isLive;
    const { error } = await supabase
      .from('lounge_settings')
      .update({ setting_value: String(newValue) })
      .eq('setting_key', 'is_live_active');

    if (!error) {
      setIsLive(newValue);
      setSuccessMsg(`Successfully updated! Stream is now ${newValue ? 'LIVE' : 'OFFLINE'}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <div>
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <span>🔴</span> LIVE STREAM BROADCAST CONTROL
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Command whether the website displays the live stream as active or offline for visitors.
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-zinc-500 font-mono">Loading broadcast status...</p>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-semibold">Current Website Status:</span>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-ping' : 'bg-zinc-600'}`}></span>
                <h5 className="text-base font-bold text-white">
                  {isLive ? 'LIVE FEED ACTIVE & STREAMING' : 'BROADCAST IS CURRENTLY OFFLINE'}
                </h5>
              </div>
            </div>

            <button
              onClick={toggleLiveStatus}
              className={`font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg ${
                isLive
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/20'
              }`}
            >
              {isLive ? '🛑 Turn Stream OFF' : '🔴 Turn Stream ON'}
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl text-center">
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
};