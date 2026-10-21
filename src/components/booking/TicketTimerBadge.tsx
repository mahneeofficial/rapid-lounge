import React, { useState, useEffect } from 'react';

interface TicketTimerBadgeProps {
  createdTime: string; // ISO timestamp when payment was verified
  eventDate: string;   // Date of the reservation (YYYY-MM-DD)
}

export const TicketTimerBadge: React.FC<TicketTimerBadgeProps> = ({ createdTime, eventDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const eventTimestamp = new Date(`${eventDate}T21:00:00`).getTime();
      const bookingTimestamp = createdTime ? new Date(createdTime).getTime() : now;

      // Cancellation deadline is 24 hours after booking OR 24 hours before event starts
      const deadline = Math.min(bookingTimestamp + 24 * 60 * 60 * 1000, eventTimestamp - 24 * 60 * 60 * 1000);
      const diff = deadline - now;

      if (diff <= 0) {
        setIsLocked(true);
        setTimeLeft(null);
      } else {
        setIsLocked(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [createdTime, eventDate]);

  if (isLocked) {
    return (
      <div className="bg-red-500/10 border border-red-500/40 px-3 py-1.5 rounded-xl text-center inline-block animate-pulse">
        <span className="text-red-400 font-bold font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 justify-center">
          🔒 NON-REFUNDABLE LOCKDOWN
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-center space-y-0.5">
      <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block">
        ⏱️ Cancellation Window Closes In:
      </span>
      {timeLeft && (
        <span className="text-xs font-mono font-black text-amber-300">
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      )}
    </div>
  );
};