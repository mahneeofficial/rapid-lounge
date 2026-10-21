import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  ticketCode: string;
  resName: string;
  selectedUnit: string;
  resDate: string;
  resTime: string;
  resGuests: string;
  totalPayable: number;
  onReset: () => void;
}

export const SuccessPass: React.FC<Props> = ({
  ticketCode, resName, selectedUnit, resDate, resTime, resGuests, totalPayable, onReset
}) => {
  return (
    <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Payment Confirmed & Pass Issued!</h3>
        <p className="text-xs text-zinc-400">Show this verified digital pass at Rapid Lounge Voi entrance.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-sm mx-auto space-y-3 text-left">
        <div className="flex justify-between border-b border-zinc-800 pb-3">
          <span className="text-xs text-zinc-500">Digital Pass Code:</span>
          <span className="font-mono text-cyan-300 font-bold">{ticketCode}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Guest Name:</span>
          <span className="font-semibold">{resName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Booked Unit:</span>
          <span className="font-semibold text-amber-400">{selectedUnit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Date & Time:</span>
          <span className="font-semibold">{resDate} @ {resTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Guests:</span>
          <span className="font-semibold">{resGuests}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
          <span className="text-zinc-500">Amount Paid:</span>
          <span className="text-emerald-400 font-bold font-mono">KES {totalPayable.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="text-xs text-zinc-400 hover:text-amber-400 underline"
      >
        Make Another Booking
      </button>
    </div>
  );
};