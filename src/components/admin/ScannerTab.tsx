import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Reservation {
  id: number;
  customer_name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  unit_booked: string;
  total_amount: number;
  ticket_code: string;
  payment_status: string;
  status: string;
  created_at: string;
}

interface ScannerTabProps {
  reservations: Reservation[];
  passSearch: string;
  setPassSearch: (val: string) => void;
  searchResult: Reservation | null;
  onSearch: (e: React.FormEvent) => void;
  onCheckIn: (id: number, currentStatus: string) => void;
  onExportCSV: () => void;
  totalRevenue: number;
  loading: boolean;
}

export const ScannerTab: React.FC<ScannerTabProps> = ({
  reservations,
  passSearch,
  setPassSearch,
  searchResult,
  onSearch,
  onCheckIn,
  onExportCSV,
  totalRevenue,
  loading,
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const todayStr = new Date().toISOString().slice(0, 10);

  const getDynamicStatus = (res: Reservation) => {
    if (res.status === 'Checked-In') return 'Checked-In';
    if (res.date < todayStr) return 'Expired';
    return res.status || 'Confirmed';
  };

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showCamera) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          setPassSearch(decodedText);
          setShowCamera(false);
          scanner?.clear();
        },
        () => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [showCamera]);

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Total Revenue (Till 1815773)
            </span>
            <p className="text-xl font-black text-amber-400 mt-1 font-mono">
              KES {totalRevenue.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onExportCSV}
            className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[10px] px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
          >
            <span>📥</span> CSV
          </button>
        </div>

        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            Total Reservations
          </span>
          <p className="text-xl font-black text-white mt-1 font-mono">{reservations.length}</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            Checked-In Guests
          </span>
          <p className="text-xl font-black text-emerald-400 mt-1 font-mono">
            {reservations.filter((r) => r.status === 'Checked-In').length}
          </p>
        </div>
      </div>

      {/* Verification Inputs */}
      <div className="space-y-3">
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Pass Code (e.g. RL-VIP-104227) or Phone Number..."
            value={passSearch}
            onChange={(e) => setPassSearch(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowCamera(!showCamera)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-3 rounded-xl transition text-xs whitespace-nowrap border border-zinc-700"
          >
            {showCamera ? 'Close Camera' : '📷 Camera QR'}
          </button>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg shadow-amber-500/10"
          >
            Verify Pass
          </button>
        </form>

        {/* Camera Scanner Viewfinder */}
        {showCamera && (
          <div className="bg-zinc-950 border border-amber-500/40 p-4 rounded-2xl text-center space-y-3">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Point Camera at Customer QR Code</h5>
            <div id="qr-reader" className="max-w-md mx-auto overflow-hidden rounded-xl"></div>
          </div>
        )}
      </div>

      {/* Search Result Inspector */}
      {searchResult && (
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold font-mono">
                {searchResult.ticket_code}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">{searchResult.customer_name}</h4>
              <p className="text-xs text-zinc-400">
                {searchResult.phone} • {searchResult.guests}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase font-mono ${
                  getDynamicStatus(searchResult) === 'Checked-In'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : getDynamicStatus(searchResult) === 'Expired'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {getDynamicStatus(searchResult)}
              </span>

              {getDynamicStatus(searchResult) !== 'Expired' && (
                <button
                  onClick={() => onCheckIn(searchResult.id, searchResult.status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    searchResult.status === 'Checked-In'
                      ? 'bg-emerald-500 text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  {searchResult.status === 'Checked-In' ? '✓ Checked-In' : 'Mark as Checked-In'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border-t border-amber-500/20 pt-3">
            <div>
              <span className="text-zinc-500 block text-[10px]">Unit Booked:</span>
              <p className="font-semibold text-white">{searchResult.unit_booked}</p>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Date & Time:</span>
              <p className="font-semibold text-zinc-300">
                {searchResult.date} @ {searchResult.time}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Amount Paid:</span>
              <p className="font-semibold text-amber-400 font-mono">
                KES {Number(searchResult.total_amount).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Data Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-400 tracking-wider">ALL LIVE RESERVATIONS</h4>
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3">Pass Code</th>
                <th className="p-3">Guest Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Date/Time</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {reservations.map((r) => {
                const effectiveStatus = getDynamicStatus(r);
                const isExpired = effectiveStatus === 'Expired';

                return (
                  <tr key={r.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-3 font-mono text-amber-400 font-bold">{r.ticket_code}</td>
                    <td className="p-3 font-semibold text-white">{r.customer_name}</td>
                    <td className="p-3 text-zinc-400 font-mono">{r.phone}</td>
                    <td className="p-3">{r.unit_booked}</td>
                    <td className="p-3 text-zinc-400 font-mono">
                      {r.date} @ {r.time}
                    </td>
                    <td className="p-3 font-bold text-amber-400 font-mono">
                      KES {Number(r.total_amount).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                          effectiveStatus === 'Checked-In'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isExpired
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {effectiveStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isExpired ? (
                        <span className="text-[10px] text-zinc-600 font-mono italic">Expired</span>
                      ) : (
                        <button
                          onClick={() => onCheckIn(r.id, r.status)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-lg text-[10px] font-bold transition"
                        >
                          {r.status === 'Checked-In' ? 'Undo' : 'Check-In'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {reservations.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-zinc-500 font-mono">
                    No reservations found in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};