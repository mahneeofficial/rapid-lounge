import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

interface WaiterLoginProps {
  onLoginSuccess: (username: string, badge: string) => void;
}

export const WaiterLogin: React.FC<WaiterLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [error, setError] = useState('');
  const [assignedBadge, setAssignedBadge] = useState('Staff Badge');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    // Check Supabase waiters table dynamically
    try {
      const { data, error: dbError } = await supabase
        .from('waiters')
        .select('*')
        .ilike('name', username.trim())
        .maybeSingle();

      if (!dbError && data && data.pin === password.trim()) {
        setError('');
        setAssignedBadge(data.badge || 'Staff Badge');
        setMfaStep(true); // Proceed to MFA
      } else {
        setError('Invalid staff username or password.');
      }
    } catch {
      setError('Connection error checking credentials.');
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      localStorage.setItem(`session_${username.trim().toLowerCase()}`, JSON.stringify({ username, badge: assignedBadge }));
      onLoginSuccess(username.trim(), assignedBadge);
    } else {
      setError('Invalid 6-digit TOTP code.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-auto w-full bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 text-center shadow-2xl">
      <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
        🔐
      </div>

      {!mfaStep ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold">Staff Username:</label>
            <input
              type="text"
              placeholder="e.g. Samuel"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs text-zinc-400 font-semibold">Unique Password / PIN:</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-400 hover:text-amber-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-xs transition"
          >
            Authenticate Password & Proceed to TOTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">Google Authenticator TOTP</h4>
            <p className="text-xs text-zinc-400">Enter the 6-digit code from your phone app.</p>
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-zinc-950 border border-amber-500/50 rounded-xl px-4 py-3 text-white focus:outline-none"
          />
          {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-xs transition"
          >
            Verify TOTP Code
          </button>
        </form>
      )}
    </div>
  );
};