import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { AdminGuard } from './admin/AdminGuard';
import { ScannerTab } from './admin/ScannerTab';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { WaiterDispatchTab } from './admin/WaiterDispatchTab';
import { AuditReconciliationTab } from './admin/AuditReconciliationTab';
import { MenuManagerTab } from './admin/MenuManagerTab';
import { InventoryUnitsTab } from './admin/InventoryUnitsTab';
import { LiveSettingsTab } from './admin/LiveSettingsTab';

interface ManagerModalProps {
  showManagerModal: boolean;
  setShowManagerModal: (show: boolean) => void;
  setVibeStatus?: (status: string) => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({ showManagerModal, setShowManagerModal }) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'units' | 'dispatch' | 'menu' | 'live' | 'audit' | 'analytics'>('scanner');
  const [reservations, setReservations] = useState<any[]>([]);
  const [passSearch, setPassSearch] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showManagerModal) {
      fetchReservations();
    }
  }, [showManagerModal]);

  const fetchReservations = async () => {
    setLoading(true);
    const { data } = await supabase.from('reservations').select('*').order('id', { ascending: false });
    if (data) setReservations(data);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passSearch.trim()) return;
    const query = passSearch.trim().toLowerCase();
    const match = reservations.find(
      (r) => r.ticket_code.toLowerCase().includes(query) || r.phone.includes(query) || r.customer_name.toLowerCase().includes(query)
    );
    setSearchResult(match || null);
  };

  const handleCheckIn = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Checked-In' ? 'Confirmed' : 'Checked-In';
    await supabase.from('reservations').update({ status: nextStatus }).eq('id', id);
    fetchReservations();
    if (searchResult && searchResult.id === id) {
      setSearchResult({ ...searchResult, status: nextStatus });
    }
  };

  const handleExportCSV = () => {
    if (reservations.length === 0) return;
    const headers = ['Pass Code', 'Customer Name', 'Phone', 'Unit', 'Date', 'Time', 'Amount (KES)', 'Status'];
    const rows = reservations.map((r) => [
      r.ticket_code,
      `"${r.customer_name}"`,
      r.phone,
      `"${r.unit_booked}"`,
      r.date,
      r.time,
      r.total_amount,
      r.status || 'Confirmed',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Rapid_Lounge_Reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);

  if (!showManagerModal) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div>
            <h3 className="text-xl font-serif font-extrabold text-white flex items-center gap-2">
              <span>🛡️</span> MANAGER COMMAND CENTER
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Till 1815773 • Protected Portal</p>
          </div>
          <button
            onClick={() => {
              setShowManagerModal(false);
              window.location.hash = '';
            }}
            className="w-9 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AdminGuard>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'scanner' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  🚪 Entrance Scanner
                </button>
                <button
                  onClick={() => setActiveTab('units')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'units' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  🏢 Tables & Rooms
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'menu' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  🍔 Menu & Stock
                </button>
                <button
                  onClick={() => setActiveTab('dispatch')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'dispatch' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  👔 Staff Roster
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'live' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  🔴 Live Stream
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'audit' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  📑 Shift Closing
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'analytics' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}
                >
                  📊 Peak Heatmap
                </button>
              </div>

              {activeTab === 'scanner' && (
                <ScannerTab
                  reservations={reservations}
                  passSearch={passSearch}
                  setPassSearch={setPassSearch}
                  searchResult={searchResult}
                  onSearch={handleSearch}
                  onCheckIn={handleCheckIn}
                  onExportCSV={handleExportCSV}
                  totalRevenue={totalRevenue}
                  loading={loading}
                />
              )}
              {activeTab === 'units' && <InventoryUnitsTab />}
              {activeTab === 'menu' && <MenuManagerTab />}
              {activeTab === 'dispatch' && <WaiterDispatchTab />}
              {activeTab === 'live' && <LiveSettingsTab />}
              {activeTab === 'audit' && <AuditReconciliationTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
            </div>
          </AdminGuard>
        </div>
      </div>
    </div>
  );
};