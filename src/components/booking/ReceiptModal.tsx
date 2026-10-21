import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiptModalProps {
  isOpen: boolean;
  reservation: {
    ticket_code: string;
    customer_name: string;
    phone: string;
    date: string;
    time: string;
    unit_booked: string;
    guests: string;
    total_amount: number;
    payment_status: string;
  } | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, reservation, onClose }) => {
  if (!isOpen || !reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">🖨️ Official Venue Receipt</h4>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div id="printable-receipt" className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-4 font-mono text-xs text-zinc-300">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-800">
            <h3 className="font-serif font-black text-white text-base">RAPID LOUNGE VOI</h3>
            <p className="text-[10px] text-zinc-500">Ultimate Nightlife & Entertainment Hub</p>
            <p className="text-[10px] text-amber-400">M-Pesa Till: 1815773</p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Pass Code:</span>
              <span className="text-amber-400 font-bold">{reservation.ticket_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer:</span>
              <span className="text-white font-bold">{reservation.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Phone:</span>
              <span>{reservation.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Reserved Unit:</span>
              <span className="text-white font-bold">{reservation.unit_booked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Date & Time:</span>
              <span>{reservation.date} @ {reservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Capacity / Type:</span>
              <span>{reservation.guests}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-dashed border-zinc-800 space-y-1">
            <div className="flex justify-between font-bold text-sm">
              <span className="text-zinc-400">Total Paid:</span>
              <span className="text-amber-400 font-mono">KES {Number(reservation.total_amount).toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-emerald-400 font-sans text-center mt-1">
              ✓ {reservation.payment_status}
            </p>
          </div>

          {/* QR Code for Door Bouncer */}
          <div className="pt-4 text-center space-y-2">
            <div className="bg-white p-3 rounded-xl inline-block">
              <QRCodeSVG value={reservation.ticket_code} size={110} level="H" />
            </div>
            <p className="text-[9px] text-zinc-500 font-sans">Scan at entrance for instant database check-in.</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl text-xs transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};