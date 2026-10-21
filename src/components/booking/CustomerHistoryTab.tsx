import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TicketRecord {
  id: number;
  ticket_code: string;
  customer_name: string;
  phone: string;
  unit_booked: string;
  date: string;
  time: string;
  total_amount: number;
  payment_status: string;
  status: string;
  created_at: string;
}

interface CustomerHistoryTabProps {
  records: TicketRecord[];
  onOpenReceipt: (ticket: TicketRecord) => void;
  onOpenWhatsApp: (ticket: TicketRecord) => void;
  onNavigateToMenu: () => void;
}

export const CustomerHistoryTab: React.FC<CustomerHistoryTabProps> = ({
  records,
  onOpenReceipt,
  onOpenWhatsApp,
  onNavigateToMenu,
}) => {
  const [activeTicket, setActiveTicket] = useState<TicketRecord | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const evaluateLockdown = (eventDate: string) => {
    if (eventDate < todayStr) return { label: 'EXPIRED', class: 'bg-zinc-800 text-zinc-500 border-zinc-700' };
    if (eventDate === todayStr) return { label: '🔒 NON-REFUNDABLE (Lockdown Active)', class: 'bg-red-500/20 text-red-400 border-red-500/40' };
    return { label: '✅ REFUNDABLE WINDOW', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  };

  const handleAddToCalendar = (t: TicketRecord) => {
    const title = encodeURIComponent(`VIP Reservation @ Rapid Lounge Voi (${t.unit_booked})`);
    const details = encodeURIComponent(`Pass Code: ${t.ticket_code}\nName: ${t.customer_name}\nPhone: ${t.phone}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(calendarUrl, '_blank');
  };

  const handleOpenMaps = () => {
    window.open('https://maps.google.com/?q=Rapid+Lounge+Voi+Kaloleni+Main+Road', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-3xl space-y-2">
        <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">My Passes & Receipts</span>
        <h3 className="text-xl font-serif font-black text-white">RESERVATION & PASS HISTORY</h3>
        <p className="text-xs text-zinc-400">View active tickets, print thermal receipts, or manage VIP lounge orders.</p>
      </div>

      {records.length === 0 ? (
        <div className="p-12 bg-zinc-950/60 border border-zinc-800/80 rounded-3xl text-center text-xs text-zinc-500 font-mono">
          No active or historical tickets found on this device.
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((t) => {
            const lockdown = evaluateLockdown(t.date);

            return (
              <div key={t.id} className="bg-zinc-900/80 border border-zinc-800/80 p-6 rounded-3xl space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-mono font-bold">
                      {t.ticket_code}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{t.unit_booked}</h4>
                    <p className="text-xs text-zinc-400 font-mono">{t.date} @ {t.time}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-lg font-black text-amber-400 font-mono">
                      KES {Number(t.total_amount).toLocaleString()}
                    </span>
                    <span className={`text-[9px] px-2.5 py-1 rounded-lg font-bold font-mono border ${lockdown.class}`}>
                      {lockdown.label}
                    </span>
                  </div>
                </div>

                {/* 10 Professional Action Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTicket(t)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>👁️</span> Pass QR
                  </button>

                  <button
                    onClick={() => onOpenWhatsApp(t)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>💬</span> WhatsApp
                  </button>

                  <button
                    onClick={() => onOpenReceipt(t)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>🖨️</span> Receipt
                  </button>

                  <button
                    onClick={onNavigateToMenu}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>🍾</span> Add Drinks
                  </button>

                  <button
                    onClick={() => handleAddToCalendar(t)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>📅</span> Calendar
                  </button>

                  <button
                    onClick={handleOpenMaps}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>📍</span> Map Direction
                  </button>

                  <a
                    href="tel:+254712345678"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-center"
                  >
                    <span>📞</span> VIP Host
                  </a>

                  <button
                    onClick={() => alert(`Table upgrade request for ${t.ticket_code} sent to VIP Director.`)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>⭐</span> Upgrade
                  </button>

                  <button
                    onClick={() => alert(`Verification receipt status: ${t.payment_status}`)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>📑</span> Status
                  </button>

                  <button
                    onClick={() => alert('Record archived from device history.')}
                    className="bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>✕</span> Delete
                  </button>
                </div>

                {/* Expanded QR Code Viewer */}
                {activeTicket?.id === t.id && (
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 text-center space-y-3 animate-in fade-in">
                    <div className="bg-white p-3 rounded-xl inline-block mx-auto">
                      <QRCodeSVG value={t.ticket_code} size={140} level="H" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">Scan code at VIP table for server verification.</p>
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="text-xs text-zinc-500 hover:text-white underline font-mono"
                    >
                      Hide QR
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};