import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface EventItem {
  id: number;
  title: string;
  dj: string;
  event_date: string;
  time_slot: string;
  tag: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export const EventsManagerTab: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [dj, setDj] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('id', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !timeSlot) return;

    const { error } = await supabase.from('events').insert([{
      title,
      dj,
      event_date: eventDate,
      time_slot: timeSlot,
      tag,
      description,
      image_url: imageUrl,
      is_active: true
    }]);

    if (!error) {
      setTitle('');
      setDj('');
      setEventDate('');
      setTimeSlot('');
      setTag('');
      setDescription('');
      setImageUrl('');
      fetchEvents();
    }
  };

  const toggleEventStatus = async (id: number, currentStatus: boolean) => {
    await supabase.from('events').update({ is_active: !currentStatus }).eq('id', id);
    fetchEvents();
  };

  const deleteEvent = async (id: number) => {
    if (window.confirm('Delete this event permanently?')) {
      await supabase.from('events').delete().eq('id', id);
      fetchEvents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <div>
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <span>🎉</span> WEEKLY VIBE & EVENT SCHEDULE MANAGER
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Post upcoming parties and guest DJs. Changes reflect live on the website schedule.
          </p>
        </div>

        <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Event Title (e.g. Friday Afrobeat)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="DJ / MC Name (e.g. DJ Kalonji)"
            value={dj}
            onChange={(e) => setDj(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Event Date (e.g. Every Friday)"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Time Slot (e.g. 20:00 - 03:00)"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Tag (e.g. Tourist Favorite)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            placeholder="Cover Image URL (Optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <textarea
            placeholder="Event Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="sm:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 h-16"
          />

          <button
            type="submit"
            className="sm:col-span-3 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2.5 rounded-xl text-xs transition"
          >
            + Post Event to Live Schedule
          </button>
        </form>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3">Title & DJ</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-zinc-800/40">
                  <td className="p-3 font-bold text-white">
                    {evt.title}
                    <p className="text-[10px] text-amber-400 font-mono">🎧 {evt.dj}</p>
                  </td>
                  <td className="p-3 font-mono text-zinc-300">
                    {evt.event_date} ({evt.time_slot})
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        evt.is_active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {evt.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => toggleEventStatus(evt.id, evt.is_active)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    >
                      {evt.is_active ? 'Archive' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};