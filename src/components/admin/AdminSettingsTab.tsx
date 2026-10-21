import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

interface AdminSettingsTabProps {
  userProfile: any;
  onProfileUpdate: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ userProfile, onProfileUpdate }) => {
  const [email, setEmail] = useState(userProfile?.email || 'manager@rapidlounge.co.ke');
  const [phone, setPhone] = useState(userProfile?.phone || '0712345678');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');
  const [totpEnabled, setTotpEnabled] = useState(userProfile?.totp_enabled || false);
  const [newPassword, setNewPassword] = useState('');
  
  // Operational Settings State
  const [vibeText, setVibeText] = useState('🔥 Packed & Lit - Doors Open!');
  const [mpesaTill, setMpesaTill] = useState('1815773');
  const [msg, setMsg] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: any = {
      email,
      phone,
      avatar_url: avatarUrl,
      totp_enabled: totpEnabled,
    };

    if (newPassword.trim()) {
      updateData.password_hash = newPassword.trim();
    }

    const { error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('username', userProfile?.username || 'admin');

    if (!error) {
      setMsg('Profile & Settings saved successfully!');
      onProfileUpdate();
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card (WhatsApp Style) */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            👤 MANAGER PROFILE & AVATAR
          </h4>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-amber-500 overflow-hidden bg-zinc-900 flex items-center justify-center text-3xl font-bold text-amber-400">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Manager Avatar" className="w-full h-full object-cover" />
              ) : (
                '👨‍💼'
              )}
            </div>

            <div className="space-y-2 flex-1 w-full">
              <input
                type="text"
                placeholder="Avatar Image URL (e.g. https://...)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <p className="text-[10px] text-zinc-500">Paste an image link to update your portal avatar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-zinc-400">Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">WhatsApp Phone Number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
              />
            </div>
          </div>
        </div>

        {/* Security & Optional TOTP Toggle */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            🔒 SECURITY & AUTHENTICATOR (TOTP)
          </h4>

          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div>
              <h5 className="text-xs font-bold text-white">Require Google Authenticator TOTP</h5>
              <p className="text-[10px] text-zinc-400">Enforce 6-digit MFA code on login. Toggle off for single-step password login.</p>
            </div>
            <input
              type="checkbox"
              checked={totpEnabled}
              onChange={(e) => setTotpEnabled(e.target.checked)}
              className="w-5 h-5 accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400">Change Password (leave blank to keep current):</label>
            <input
              type="password"
              placeholder="New password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
            />
          </div>
        </div>

        {/* Operational Preferences */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            ⚙️ LOUNGE OPERATIONAL SETTINGS
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400">Live Top Vibe Banner Text:</label>
              <input
                type="text"
                value={vibeText}
                onChange={(e) => setVibeText(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">M-Pesa Display Till Number:</label>
              <input
                type="text"
                value={mpesaTill}
                onChange={(e) => setMpesaTill(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
              />
            </div>
          </div>
        </div>

        {msg && <p className="text-xs text-emerald-400 font-bold text-center">{msg}</p>}

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-xl text-xs transition"
        >
          Save All Settings & Update Profile
        </button>
      </form>
    </div>
  );
};