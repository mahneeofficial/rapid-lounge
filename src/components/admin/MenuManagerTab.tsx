import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { CustomModal } from '../ui/CustomModal';

export const MenuManagerTab: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Whiskey & Spirit');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Selection & Modal State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('menu_items').select('*').order('id', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  // Convert File to Base64 String for Storage/Display
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setModalConfig({
          isOpen: true,
          title: 'Image Too Large',
          message: 'Please select an image file under 2MB.',
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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setModalConfig({
        isOpen: true,
        title: 'Missing Details',
        message: 'Please enter item name and price.',
        type: 'alert',
      });
      return;
    }

    const newItem = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      stock_quantity: parseInt(stockQuantity) || 50,
      is_available: true,
      image_url: imagePreview || null,
    };

    const { error } = await supabase.from('menu_items').insert([newItem]);

    if (!error) {
      setName('');
      setDescription('');
      setPrice('');
      setImagePreview('');
      fetchMenuItems();
      setModalConfig({
        isOpen: true,
        title: 'Item Added',
        message: `${name} has been added to the live menu.`,
        type: 'alert',
      });
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const executeBatchDelete = async () => {
    if (selectedIds.length === 0) return;

    await supabase.from('menu_items').delete().in('id', selectedIds);
    setSelectedIds([]);
    fetchMenuItems();
    setModalConfig({
      isOpen: false,
      title: '',
      message: '',
      type: 'alert',
    });
  };

  const confirmDeleteSelected = () => {
    setModalConfig({
      isOpen: true,
      title: 'Batch Delete Confirmation',
      message: `Are you sure you want to delete ${selectedIds.length} selected item(s) from the digital menu?`,
      type: 'confirm',
      action: executeBatchDelete,
    });
  };

  return (
    <div className="space-y-6">
      {/* Form: Add New Menu Item */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          🍔 DIGITAL MENU & INVENTORY MANAGER
        </h4>

        <form onSubmit={handleAddItem} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Item Name (e.g. Chrome Vodka 750ml)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Price (KES)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
            >
              <option value="Whiskey & Spirit">Whiskey & Spirit</option>
              <option value="Beers & Ciders">Beers & Ciders</option>
              <option value="Cocktails">Cocktails</option>
              <option value="Nyama Choma & Grill">Nyama Choma & Grill</option>
              <option value="Soft Drinks">Soft Drinks</option>
            </select>

            <input
              type="number"
              placeholder="Stock Quantity (e.g. 50)"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
            />

            {/* Gallery Image File Upload Button */}
            <label className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-center transition flex items-center justify-center gap-2">
              <span>📷</span> Select Photo from Gallery
              <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
            </label>
          </div>

          {/* Image Preview Box */}
          {imagePreview && (
            <div className="flex items-center gap-3 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 max-w-sm">
              <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
              <span className="text-[10px] text-zinc-400 font-mono">Photo attached & ready</span>
              <button
                type="button"
                onClick={() => setImagePreview('')}
                className="text-red-400 hover:text-red-300 text-xs ml-auto pr-2"
              >
                ✕ Remove
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition shadow-lg"
          >
            + Save Item to Digital Menu
          </button>
        </form>
      </div>

      {/* Live Menu Table with Bulk Selection */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            LIVE MENU ITEMS ({items.length})
          </h4>

          {selectedIds.length > 0 && (
            <button
              onClick={confirmDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg"
            >
              🗑️ Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-zinc-500 font-mono text-center py-6">Loading items...</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center px-3 py-1.5 text-[10px] text-zinc-500 font-mono uppercase">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds.length === items.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 mr-3"
              />
              <span className="flex-1">Item & Photo</span>
              <span className="w-24 text-right">Price</span>
              <span className="w-24 text-right">Stock</span>
            </div>

            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-center p-3 rounded-xl border transition text-xs ${
                    isSelected ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(item.id)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-amber-500 mr-3"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        '🍹'
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-400 font-mono uppercase">{item.category}</span>
                      <p className="font-bold text-white">{item.name}</p>
                    </div>
                  </div>

                  <span className="w-24 text-right font-mono font-bold text-amber-400">
                    KES {Number(item.price).toLocaleString()}
                  </span>

                  <span className="w-24 text-right font-mono text-zinc-400">
                    Qty: {item.stock_quantity ?? 50}
                  </span>
                </div>
              );
            })}
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