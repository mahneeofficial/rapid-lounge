import React from 'react';

interface BookingCheckoutFormProps {
  selectedUnit: any | null;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  todayStr: string;
  seatsToBook: number;
  setSeatsToBook: (num: number) => void;
  pricingMode: 'per-table' | 'per-seat';
  setPricingMode: (mode: 'per-table' | 'per-seat') => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  totalPayable: number;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingCheckoutForm: React.FC<BookingCheckoutFormProps> = ({
  selectedUnit,
  bookingDate,
  setBookingDate,
  todayStr,
  seatsToBook,
  setSeatsToBook,
  pricingMode,
  setPricingMode,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  totalPayable,
  onSubmit,
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-5 shadow-xl h-fit sticky top-24">
      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">2. Reservation & Payment</h4>

      {selectedUnit ? (
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase font-mono">{selectedUnit.zone}</span>
          <p className="font-bold text-white">{selectedUnit.name}</p>
          <p className="font-mono text-amber-400 font-bold">
            KES {Number(selectedUnit.price).toLocaleString()} {selectedUnit.category === 'table' ? '(Flat Rate)' : '/ night'}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
          Select a table section or overnight room on the left to begin.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-400 font-medium block mb-1">Reservation Date (Today or Future):</label>
          <input
            type="date"
            min={todayStr}
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {selectedUnit && selectedUnit.category === 'table' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-zinc-400 font-medium">Seats to Reserve:</label>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                Max Available: {selectedUnit.remaining_seats}
              </span>
            </div>
            <input
              type="number"
              min={1}
              max={selectedUnit.remaining_seats}
              value={seatsToBook}
              onChange={(e) => {
                const val = Math.min(
                  selectedUnit.remaining_seats,
                  Math.max(1, parseInt(e.target.value) || 1)
                );
                setSeatsToBook(val);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPricingMode('per-table')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                  pricingMode === 'per-table'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}
              >
                Flat Table Rate
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('per-seat')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition ${
                  pricingMode === 'per-seat'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}
              >
                Per-Seat Rate
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="text-zinc-400 font-medium block mb-1">Full Name:</label>
          <input
            type="text"
            placeholder="e.g. Brian Kimani"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-zinc-400 font-medium block mb-1">M-Pesa Phone Number:</label>
          <input
            type="tel"
            placeholder="0712345678"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <p className="text-[10px] text-zinc-500 italic">
          * Note: Reservations lock down and become non-refundable within 24 hours of event date.
        </p>

        <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
          <span className="text-zinc-400">Total Payable:</span>
          <span className="text-amber-400 font-mono text-base">KES {totalPayable.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          disabled={!selectedUnit || selectedUnit.is_full}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/10 mt-2"
        >
          Pay KES {totalPayable.toLocaleString()} via M-Pesa (Till 1815773)
        </button>
      </form>
    </div>
  );
};