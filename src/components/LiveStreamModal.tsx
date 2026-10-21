import React from 'react';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const socialPlatforms = [
    {
      name: 'TikTok Live',
      desc: 'Watch raw, unedited live decks and resident DJ sets from the club floor[cite: 1].',
      badge: 'Live Stream',
      color: 'from-pink-500/20 to-black border-pink-500/40 text-pink-400',
      btnColor: 'bg-pink-500 hover:bg-pink-600 text-white',
      url: 'https://www.google.com/goto?url=CAEScAHrOzAVlxp5ZzGLL9_zUKcOcTEjucm_bP9qaMRmPLyy8OHZVu9uH1XawHvQ-ZDwOHzxFN4arBAdtMb3z-z208ikOS8e2lrfhT1zkFgyicmLBDCUKGIhTjbOcd-m0tqJSGkGVSOmkwpKNxv0faczNjw',
    },
    {
      name: 'Instagram Stories',
      desc: 'See real-time crowd energy and highlights before you leave the house[cite: 1].',
      badge: 'Daily Stories',
      color: 'from-purple-500/20 to-black border-purple-500/40 text-purple-400',
      btnColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white',
      url: 'https://www.google.com/goto?url=CAESYQHrOzAVwQ26opn0f_9gogPfstgCjtiq16e97YhYyBpZNeMRWoeC2oY62V4CaNJTX69LaJGjkWZ0zhWGlzER3z_7A77rCWdqCvwGKNzN4yS6s4ymsBDKDZ2Q3LAJ1QcxNl0',
    },
    {
      name: 'Facebook Broadcasts',
      desc: 'Catch full video clips of Sunday brunches and English Premier League matches[cite: 1].',
      badge: 'Long Videos',
      color: 'from-blue-500/20 to-black border-blue-500/40 text-blue-400',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: 'https://www.google.com/goto?url=CAESYAHrOzAVEX9FgvftklklG_hvRgdNWvVMzXYr3-YS2YsR0IDl8RAapaRejE9oSJjAei1OvV13xF8TU9fNq_HdpzGxdfoJbDZxrYwyxzdsiRD0-TJl0Nw-V60m2UhwBbkTxw',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden flex flex-col shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-serif font-extrabold text-white flex items-center gap-2">
              <span>🔴</span> CHOOSE LIVE BROADCAST PLATFORM
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Select where you want to watch Rapid Lounge Voi in real-time.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Platform Selection Cards */}
        <div className="space-y-3">
          {socialPlatforms.map((platform, idx) => (
            <a
              key={idx}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-2xl border bg-gradient-to-r ${platform.color} flex justify-between items-center group hover:scale-[1.01] transition shadow-lg`}
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{platform.name}</h4>
                  <span className="text-[9px] bg-black/50 border border-white/10 px-2 py-0.5 rounded-full font-mono uppercase">
                    {platform.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{platform.desc}</p>
              </div>
              <span className={`text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition ${platform.btnColor}`}>
                Watch Live ➔
              </span>
            </a>
          ))}
        </div>

        <p className="text-[10px] text-zinc-500 text-center font-mono">
          Streams open securely in a new browser tab.
        </p>
      </div>
    </div>
  );
};