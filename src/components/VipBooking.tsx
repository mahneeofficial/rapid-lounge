import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PaymentModal } from './booking/PaymentModal';
import { WhatsAppPassModal } from './booking/WhatsAppPassModal';
import { InteractiveFloorMap } from './booking/InteractiveFloorMap';
import { BookingFilterToolbar } from './booking/BookingFilterToolbar';
import { BookingCheckoutForm } from './booking/BookingCheckoutForm';

interface VipBookingProps {
  cart: { name: string; price: number; qty: number; image_url?: string }[];
  addToCart: (name: string, price: number, image_url?: string) => void;
  removeFromCart: (name: string) => void;
}

export const VipBooking: React.FC<VipBookingProps> = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'table' | 'room'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [pricingMode, setPricingMode] = useState<'per-table' | 'per-seat'>('per-table');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'prompt' | 'processing' | 'error'>('prompt');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedPassCode, setConfirmedPassCode] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchInventory();
  }, [bookingDate]);

  const fetchInventory = async () => {
    setLoading(true);
    const { data: unitData } = await supabase.from('inventory_units').select('*').order('id', { ascending: true });
    const { data: resData } = await supabase.from('reservations').select('*').eq('date', bookingDate);

    if (unitData) {
      const computedUnits = unitData.map((unit) => {
        const bookedForUnit = resData
          ? resData
              .filter((r) => r.unit_booked.includes(unit.name) && r.status !== 'Cancelled')
              .reduce((sum, r) => sum + (r.guests ? parseInt(r.guests) || unit.total_seats : unit.total_seats), 0)
          : 0;

        const remaining = Math.max(0, unit.total_seats - bookedForUnit);
        return { ...unit, remaining_seats: remaining, is_full: remaining <= 0 };
      });
      setUnits(computedUnits);
    } else {
      setUnits([]);
    }
    setLoading(false);
  };

  const zones = ['All Zones', 'DJ Deck Zone', 'VIP Booths', 'Main Floor', 'Verandah Garden', 'SGR Transit', 'Overnight Rooms'];

  const filteredUnits = units.filter((u) => {
    const matchesCat = selectedCategory === 'all' || u.category === selectedCategory;
    const matchesZone = selectedZone === 'All Zones' || u.zone === selectedZone;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.unit_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesZone && matchesSearch;
  });

  const totalPayable = selectedUnit
    ? selectedUnit.category === 'room'
      ? selectedUnit.price
      : pricingMode === 'per-seat'
      ? selectedUnit.price * seatsToBook
      : selectedUnit.price
    : 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || selectedUnit.is_full) {
      setErrorMessage('Please select an available table or room.');
      setPaymentStep('error');
      setShowPaymentModal(true);
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please enter your full name and M-Pesa phone number.');
      setPaymentStep('error');
      setShowPaymentModal(true);
      return;
    }
    setPaymentStep('prompt');
    setShowPaymentModal(true);
  };

  const confirmMpesaPayment = async (phoneToUse?: string) => {
    const activePhone = phoneToUse || customerPhone;
    setPaymentStep('processing');

    try {
      const response = await fetch(`${API_BASE_URL}/api/stk-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: activePhone, amount: totalPayable }),
      });

      const data = await response.json();

      if (response.ok && data.ResponseCode === '0') {
        const checkoutReqId = data.CheckoutRequestID;
        let attempts = 0;

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const queryRes = await fetch(`${API_BASE_URL}/api/stk-query`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ checkoutRequestId: checkoutReqId }),
            });

            const queryData = await queryRes.json();
            if (String(queryData.ResultCode ?? '') === '0') {
              clearInterval(pollInterval);
              const ticketCode = 'RL-VIP-' + Math.floor(100000 + Math.random() * 900000);

              await supabase.from('reservations').insert([
                {
                  customer_name: customerName.trim(),
                  phone: activePhone,
                  date: bookingDate,
                  time: '21:00',
                  guests: selectedUnit.category === 'table' ? `${seatsToBook} Seats` : 'Overnight Stay',
                  unit_booked: `${selectedUnit.name} [${selectedUnit.zone}]`,
                  total_amount: totalPayable,
                  ticket_code: ticketCode,
                  payment_status: `Verified KES ${totalPayable} via Till 1815773`,
                  status: 'Confirmed',
                  checkout_request_id: checkoutReqId,
                },
              ]);

              setShowPaymentModal(false);
              setConfirmedPassCode(ticketCode);
              setShowShareModal(true);
              fetchInventory();
            } else if (attempts >= 15) {
              clearInterval(pollInterval);
              setErrorMessage('M-Pesa payment prompt timed out or was canceled.');
              setPaymentStep('error');
            }
          } catch {
            // Retry polling
          }
        }, 3000);
      } else {
        setErrorMessage(data.errorMessage || 'M-Pesa STK push failed.');
        setPaymentStep('error');
      }
    } catch {
      setErrorMessage('Backend payment server offline.');
      setPaymentStep('error');
    }
  };

  return (
    <div className="py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase">Executive Suites & VIP Tables</span>
        <h2 className="text-3xl font-serif font-black text-white">VIP BOOTH, TABLE & ROOM RESERVATIONS</h2>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto">
          Explore real venue photos, view capacity, and book executive rooms or private VIP booths with live M-Pesa Till verification.
        </p>
      </div>

      <InteractiveFloorMap
        selectedTable={selectedUnit?.unit_id || null}
        onSelectTable={(unitId) => {
          const match = units.find((u) => u.unit_id === unitId || u.name.includes(unitId));
          if (match && !match.is_full) {
            setSelectedUnit(match);
            setSeatsToBook(1);
          }
        }}
      />

      <BookingFilterToolbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        zones={zones}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-xs text-zinc-500 font-mono text-center py-12">Loading inventory from Supabase...</p>
          ) : filteredUnits.length === 0 ? (
            <div className="p-12 bg-zinc-950/80 border border-zinc-800 rounded-3xl text-center space-y-2">
              <p className="text-xs text-zinc-400 font-bold">No rooms or tables match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredUnits.map((unit) => {
                const isSelected = selectedUnit?.id === unit.id;
                const isFull = unit.is_full;

                return (
                  <div
                    key={unit.id}
                    onClick={() => {
                      if (!isFull) {
                        setSelectedUnit(unit);
                        setSeatsToBook(1);
                      }
                    }}
                    className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                      isFull
                        ? 'bg-zinc-950/40 border-zinc-900 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-zinc-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500 cursor-pointer'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 cursor-pointer'
                    }`}
                  >
                    {/* Real Admin-Uploaded Photo Thumbnail */}
                    <div className="w-full h-48 bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b border-zinc-800/80">
                      {unit.image_url ? (
                        <img src={unit.image_url} alt={unit.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center space-y-1">
                          <span className="text-4xl">🏨</span>
                          <p className="text-[10px] text-zinc-500 font-mono">Rapid Lounge Voi Suite</p>
                        </div>
                      )}

                      <span
                        className={`absolute top-3 right-3 text-[9px] px-3 py-1 rounded-full font-bold uppercase font-mono tracking-wider ${
                          isFull
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {isFull ? 'FULLY BOOKED' : unit.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-amber-400 font-mono font-bold block">
                          {unit.zone} • ID: {unit.unit_id}
                        </span>
                        <h5 className="text-base font-bold text-white">{unit.name}</h5>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-xs">
                        <span className="text-zinc-400 font-mono">
                          {unit.category === 'room'
                            ? '🛏️ Overnight Stay'
                            : `👥 ${unit.remaining_seats} / ${unit.total_seats} Seats Available`}
                        </span>
                        <span className="font-black text-amber-400 font-mono text-sm">
                          KES {Number(unit.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <BookingCheckoutForm
          selectedUnit={selectedUnit}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          todayStr={todayStr}
          seatsToBook={seatsToBook}
          setSeatsToBook={setSeatsToBook}
          pricingMode={pricingMode}
          setPricingMode={setPricingMode}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          totalPayable={totalPayable}
          onSubmit={handleFormSubmit}
        />
      </div>

      {showPaymentModal && (
        <PaymentModal
          resPhone={customerPhone}
          totalPayable={totalPayable}
          paymentStep={paymentStep}
          errorMessage={errorMessage}
          onCancel={() => setShowPaymentModal(false)}
          onConfirm={(overridePhone) => confirmMpesaPayment(overridePhone)}
          onRetry={() => setPaymentStep('prompt')}
        />
      )}

      {confirmedPassCode && (
        <WhatsAppPassModal
          isOpen={showShareModal}
          ticketCode={confirmedPassCode}
          customerName={customerName}
          phone={customerPhone}
          unitBooked={selectedUnit?.name || 'VIP Section'}
          amount={totalPayable}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};