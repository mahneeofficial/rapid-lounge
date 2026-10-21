import React from 'react';

interface BookingFormProps {
  resName: string;
  setResName: (v: string) => void;
  resPhone: string;
  setResPhone: (v: string) => void;
  resDate: string;
  setResDate: (v: string) => void;
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;
  resGuests: number;
  setResGuests: (v: number) => void;
  maxCapacity: number;
  totalPayable: number;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  resName,
  setResName,
  resPhone,
  setResPhone,
  resDate,
  setResDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  resGuests,
  setResGuests,
  maxCapacity,
  totalPayable,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 pt-4 border-t border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 tracking-wider">
            FULL NAME
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Kamau"
            value={resName}
            onChange={(e) => setResName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* M-Pesa Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 tracking-wider">
            M-PESA PHONE NUMBER (TILL 1815773)
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 0712345678"
            value={resPhone}
            onChange={(e) => setResPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Reservation Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300 tracking-wider">
            RESERVATION DATE
          </label>
          <input
            type="date"
            required
            value={resDate}
            onChange={(e) => setResDate(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Start & End Time Windows (Collision Prevention) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 tracking-wider">
              START TIME
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 tracking-wider">
              END TIME
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Number of Guests */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-300 tracking-wider">
              NUMBER OF GUESTS
            </label>
            <span className="text-[10px] text-amber-500">
              Max table capacity: {maxCapacity} seats
            </span>
          </div>
          <select
            value={resGuests}
            onChange={(e) => setResGuests(Number(e.target.value))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
          >
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payable Price Banner */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex justify-between items-center">
        <span className="text-xs text-zinc-400 font-medium">
          Total Payable (Non-refundable reservation deposit):
        </span>
        <span className="text-lg font-bold text-amber-400">
          KES {totalPayable.toLocaleString()}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:opacity-95 text-black font-extrabold py-4 rounded-2xl transition shadow-xl shadow-amber-500/10 flex items-center justify-center space-x-2 text-sm tracking-wide"
      >
        <span>🔒 Pay KES {totalPayable.toLocaleString()} via Till 1815773 & Secure Pass</span>
      </button>
    </form>
  );
};