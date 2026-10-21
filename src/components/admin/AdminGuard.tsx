import React, { useState } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('rl_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const adminPin = import.meta.env.VITE_ADMIN_PIN || '1815';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin) {
      sessionStorage.setItem('rl_admin_auth', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Director/Admin PIN. Access Denied.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rl_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-500 text-3xl font-bold">
            🔒
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Admin Command Center</h3>
            <p className="text-xs text-zinc-400">Enter venue management PIN to unlock revenue & controls.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              placeholder="Enter PIN (e.g. 1815)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-amber-500"
            />

            {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] px-3 py-1.5 rounded-lg transition font-mono"
        >
          🔒 Lock Dashboard Session
        </button>
      </div>
      {children}
    </div>
  );
};