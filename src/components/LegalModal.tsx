import React from 'react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div>
            <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
              {type === 'privacy' ? '🔒 Privacy Policy & Data Protection' : '📜 Terms & Conditions of Service'}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Rapid Lounge Voi • Compliance & Customer Policy</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
          {type === 'privacy' ? (
            <>
              <p className="text-zinc-400">
                <strong>Effective Date:</strong> January 2026. Rapid Lounge Voi ("we", "us") respects customer privacy in accordance with the Kenya Data Protection Act, 2019.
              </p>
              <h4 className="font-bold text-amber-400 text-sm">1. Information We Collect</h4>
              <p>When placing an order or table booking, we collect your name, M-Pesa mobile number, and table selection to process payment dispatches and route drink deliveries.</p>

              <h4 className="font-bold text-amber-400 text-sm">2. M-Pesa Payment Security</h4>
              <p>Financial transactions are processed directly via Safaricom M-Pesa Daraja STK Push to registered Buy Goods Till <strong>1815773</strong>. We never store or request your M-Pesa PIN.</p>

              <h4 className="font-bold text-amber-400 text-sm">3. Data Usage & Third Parties</h4>
              <p>Your details are strictly used for venue entry verification and waiter order fulfillment. We do not sell, leak, or share customer data with third-party marketers.</p>
            </>
          ) : (
            <>
              <p className="text-zinc-400">
                <strong>Effective Date:</strong> January 2026. By accessing or reserving services at Rapid Lounge Voi, you agree to these terms.
              </p>
              <h4 className="font-bold text-amber-400 text-sm">1. Table Reservations & Order Dispatches</h4>
              <p>Reservations and bar orders are confirmed upon successful M-Pesa STK Push payment to Till 1815773. Issued pass codes (e.g. RL-BAR-XXXXXX) must be presented to assigned waiters upon delivery.</p>

              <h4 className="font-bold text-amber-400 text-sm">2. Anti-Fraud & Ticket Invalidation</h4>
              <p>Each receipt code is one-time use only. Upon delivery, the assigned waiter stamps the receipt as served. Attempting to present duplicate screenshots or reused codes will result in immediate pass invalidation.</p>

              <h4 className="font-bold text-amber-400 text-sm">3. Admission & Venue Policy</h4>
              <p>Management retains the right of admission. Persons under the legal drinking age of 18 in Kenya are prohibited from alcohol purchase.</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-right">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2 rounded-xl text-xs transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};