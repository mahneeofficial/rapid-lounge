import React from 'react';
import { Utensils, Bed } from 'lucide-react';

interface Props {
  bookingType: 'table' | 'room';
  setBookingType: (type: 'table' | 'room') => void;
  onTypeChange: (type: 'table' | 'room') => void;
}

export const BookingTypeSelector: React.FC<Props> = ({ bookingType, setBookingType, onTypeChange }) => {
  return (
    <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
      <button
        type="button"
        onClick={() => { setBookingType('table'); onTypeChange('table'); }}
        className={`flex-1 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
          bookingType === 'table' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Utensils className="w-4 h-4" /> Lounge Table (Paid Reservation)
      </button>
      <button
        type="button"
        onClick={() => { setBookingType('room'); onTypeChange('room'); }}
        className={`flex-1 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition ${
          bookingType === 'room' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Bed className="w-4 h-4" /> Overnight Room / Lodge
      </button>
    </div>
  );
};