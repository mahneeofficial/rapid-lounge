import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface EventItem {
  id: number;
  title: string;
  dj: string;
  event_date: string;
  time_slot: string;
  tag: string;
  description: string;
  image_url: string;
}

interface EventsSectionProps {
  setActiveTab: (tab: 'home' | 'menu' | 'events' | 'vip') => void;
  onSelectEvent?: (event: { title: string; date: string; timeSlot: string }) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ setActiveTab, onSelectEvent }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleEventBooking = (event: EventItem) => {
    if (onSelectEvent) {
      onSelectEvent({
        title: event.title,
        date: event.event_date,
        timeSlot: event.time_slot,
      });
    }
    setActiveTab('vip');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-extrabold text-white tracking-wider">WEEKLY ENTERTAINMENT SCHEDULE</h2>
        <p className="text-xs text-zinc-400 max-w-lg mx-auto">
          Reserve your table or VIP booth pre-configured with exact event dates and time slots.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs animate-pulse">
          Loading live events schedule from database...
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 text-xs">
          No active events posted yet. Manager can create events in the Admin Portal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-amber-500/50 transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evt.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {evt.tag && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {evt.tag}
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-amber-400 font-mono font-bold">
                    <span>{evt.event_date}</span>
                    <span>⏰ {evt.time_slot}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                  <p className="text-xs text-zinc-400">{evt.description}</p>
                  {evt.dj && <p className="text-[11px] text-zinc-500 font-semibold">🎧 Deejay: {evt.dj}</p>}
                </div>

                <button
                  onClick={() => handleEventBooking(evt)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
                >
                  Reserve Table for This Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};