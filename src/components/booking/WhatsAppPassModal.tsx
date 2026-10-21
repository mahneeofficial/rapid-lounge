import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface WhatsAppPassModalProps {
  isOpen: boolean;
  ticketCode: string;
  customerName: string;
  phone: string;
  unitBooked: string;
  amount: number;
  onClose: () => void;
}

export const WhatsAppPassModal: React.FC<WhatsAppPassModalProps> = ({
  isOpen,
  ticketCode,
  customerName,
  phone,
  unitBooked,
  amount,
  onClose,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [showManualGuide, setShowManualGuide] = useState(false);

  if (!isOpen) return null;

  // Format Kenyan Phone for WhatsApp wa.me link
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? `254${cleanPhone.slice(1)}`
    : cleanPhone;

  const whatsappMessage = encodeURIComponent(
    `🎟️ *RAPID LOUNGE VOI - VIP TICKET PASS*\n\n` +
    `Hello *${customerName}*,\nYour VIP Reservation at Rapid Lounge Voi is confirmed!\n\n` +
    `*Pass Code:* ${ticketCode}\n` +
    `*Reserved Unit:* ${unitBooked}\n` +
    `*Amount Paid:* KES ${amount.toLocaleString()}\n` +
    `*Till:* 1815773\n\n` +
    `Show this QR code or Pass Code at the door for entry.`
  );

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">🎟️ Verified Pass & Sharing</h4>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* QR Code Block */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3">
          <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
            <QRCodeSVG value={ticketCode} size={140} level="H" />
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-mono">Pass Code</span>
            <p className="text-xl font-black text-amber-400 font-mono tracking-widest">{ticketCode}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>💬</span> Send Ticket via WhatsApp ({phone})
          </a>

          <button
            onClick={() => setShowManualGuide(!showManualGuide)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold py-2.5 rounded-xl text-xs transition border border-zinc-700"
          >
            {showManualGuide ? 'Hide Manual Payment Instructions' : '📲 Alternative / Manual Payment Instructions'}
          </button>
        </div>

        {/* Manual Payment Guide (M-Pesa / Airtel / Bank Transfer) */}
        {showManualGuide && (
          <div className="bg-zinc-950 border border-amber-500/30 p-4 rounded-2xl text-left text-xs space-y-3 animate-in fade-in">
            <h5 className="font-bold text-amber-400 uppercase text-[11px]">Manual Buy Goods / Till Instructions</h5>
            <ol className="list-decimal list-inside text-zinc-300 space-y-1 text-[11px] font-mono">
              <li>Go to M-Pesa or Airtel Money on your phone.</li>
              <li>Select <strong>Lipa na M-Pesa</strong> → <strong>Buy Goods and Services</strong>.</li>
              <li>Enter Till Number: <strong className="text-amber-400">1815773</strong> (Rapid Lounge Voi).</li>
              <li>Enter Amount: <strong className="text-white">KES {amount.toLocaleString()}</strong>.</li>
              <li>Enter your PIN and complete transaction.</li>
            </ol>

            <div className="pt-2 border-t border-zinc-800 space-y-1.5">
              <label className="text-[10px] text-zinc-400 font-medium">Enter M-Pesa / Airtel Transaction Code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SJK829104"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
                <button
                  onClick={() => {
                    if (manualCode.length >= 6) {
                      alert(`Transaction code ${manualCode.toUpperCase()} submitted to manager for manual verification.`);
                      onClose();
                    } else {
                      alert('Please enter a valid M-Pesa/Airtel transaction code.');
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 rounded-xl text-xs"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};