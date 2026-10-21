import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { CustomModal } from '../ui/CustomModal';

export const InventoryUnitsTab: React.FC = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [zone, setZone] = useState('DJ Deck Zone');
  const [category, setCategory] = useState<'table' | 'room'>('table');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('4');
  const [imagePreview, setImagePreview] = useState<string>('');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    action?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    const { data } = await supabase.from('inventory_units').select('*').order('id', { ascending: false });
    if (data) setUnits(data);
    setLoading(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalConfig({
          isOpen: true,
          title: 'Image Too Large',
          message: 'Please choose an image file under 2MB.',
          type: 'alert',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setModalConfig({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please provide a unit name and price.',
        type: 'alert',
      });
      return;
    }

    const newUnit = {
      name: name.trim(),
      unit_id: unitId.trim() || `UNIT-${Math.floor(100 + Math.random() * 900)}`,
      zone,
      category,
      price: parseFloat(price),
      total_seats: parseInt(totalSeats) || 4,
      image_url: imagePreview || null,
    };

    const { error } = await supabase.from('inventory_units').insert([newUnit]);

    if (!error) {
      setName('');
      setUnitId('');
      setPrice('');
      setImagePreview('');
      fetchUnits();
      setModalConfig({
        isOpen: true,
        title: 'Unit Added Successfully',
        message: `${name} has been published to the VIP booking platform.`,
        type: 'alert',
      });
    } else {
      setModalConfig({
        isOpen: true,
        title: 'Database Error',
        message: error.message,
        type: 'alert',
      });
    }
  };

  const handleDelete = async (id: number) => {
    await supabase.from('inventory_units').delete().eq('id', id);
    fetchUnits();
    setModalConfig({ isOpen: false, title: '', message: '', type: 'alert' });
  };

  const confirmDelete = (id: number, unitName: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Unit Confirmation',
      message: `Are you sure you want to remove ${unitName} from the booking catalog?`,
      type: 'confirm',
      action: () => handleDelete(id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Form: Add Room, VIP Booth, or Table with Gallery Upload */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          🏢 ROOM, VIP BOOTH & TABLE CREATOR (WITH REAL GALLERY PHOTOS)
        </h4>

        <form onSubmit={handleAddUnit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Unit Name (e.g. Executive Suite 101 / VIP Booth A)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Code ID (e.g. SUITE-101 or DJ-01)"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
            <input
              type="number"
              placeholder="Price in KES (e.g. 1500 / 5000)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="DJ Deck Zone">DJ Deck Zone</option>
              <option value="VIP Booths">VIP Booths</option>
              <option value="Main Floor">Main Floor</option>
              <option value="Verandah Garden">Verandah Garden</option>
              <option value="SGR Transit">SGR Transit</option>
              <option value="Overnight Rooms">Overnight Rooms</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="table">Table / Booth Section</option>
              <option value="room">Overnight Stay Room</option>
            </select>

            <input
              type="number"
              placeholder="Capacity / Seats (e.g. 4 or 10)"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {/* Gallery Photo Picker Button */}
            <label className="flex-1 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold py-3 px-4 rounded-xl cursor-pointer text-center transition flex items-center justify-center gap-2">
              <span>📷</span> Upload Real Room / Booth Photo from Gallery
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
            </label>

            {imagePreview && (
              <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-[10px] text-amber-400 font-mono">Photo attached</span>
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="text-red-400 text-xs px-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-3 rounded-xl transition shadow-lg"
          >
            + Publish Room or Table to Booking Platform
          </button>
        </form>
      </div>

      {/* Live Catalog Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          LIVE CATALOG & ROOMS ({units.length})
        </h4>

        {loading ? (
          <p className="text-xs text-zinc-500 font-mono text-center py-6">Loading inventory...</p>
        ) : units.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6 font-mono">No rooms or tables created yet.</p>
        ) : (
          <div className="space-y-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                    {unit.image_url ? (
                      <img src={unit.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      '🛏️'
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-400 font-mono uppercase font-bold">{unit.zone} • {unit.category}</span>
                    <p className="font-bold text-white text-sm">{unit.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">ID: {unit.unit_id} | Capacity: {unit.total_seats}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    KES {Number(unit.price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => confirmDelete(unit.id, unit.name)}
                    className="text-zinc-500 hover:text-red-400 text-xs px-2 py-1 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CustomModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.action}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
};