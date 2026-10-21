import React, { useState } from 'react';

interface PaymentModalProps {
  resPhone: string;
  totalPayable: number;
  paymentStep: 'prompt' | 'processing' | 'error';
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: (payerPhone?: string) => void;
  onRetry?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  resPhone,
  totalPayable,
  paymentStep,
  errorMessage,
  onCancel,
  onConfirm,
  onRetry,
}) => {
  const [useDifferentPayer, setUseDifferentPayer] = useState(false);
  const [payerPhone, setPayerPhone] = useState('');

  const handlePay = () => {
    if (useDifferentPayer && !payerPhone) {
      alert('Please enter the M-Pesa phone number that will make the payment.');
      return;
    }
    const activePhone = useDifferentPayer ? payerPhone : resPhone;
    onConfirm(activePhone);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative text-center">
        {paymentStep === 'prompt' && (
          <>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-500 text-2xl font-bold">
              KSh
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-extrabold text-white">Confirm M-Pesa Payment</h3>
              <p className="text-zinc-400 text-sm">
                Total Amount: <span className="text-amber-400 font-semibold">KES {totalPayable.toLocaleString()}</span>
              </p>
            </div>

            {/* Third-Party Payer Toggle */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 text-left space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDifferentPayer}
                  onChange={(e) => setUseDifferentPayer(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                />
                <span className="text-xs text-zinc-300 font-medium">
                  Pay with a different M-Pesa number (e.g. friend or parent)
                </span>
              </label>

              {useDifferentPayer ? (
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Payer's M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 0712345678"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <p className="text-xs text-zinc-400">
                  Prompt will be sent to: <span className="text-amber-400 font-mono font-semibold">{resPhone}</span>
                </p>
              )}
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-3.5 rounded-xl transition shadow-lg shadow-amber-500/10 text-sm"
              >
                Send M-Pesa Prompt (Till 1815773)
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="py-8 space-y-6">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">Waiting for M-Pesa PIN Entry...</h4>
              <p className="text-xs text-zinc-400">
                Check your handset screen for the STK Push prompt to Till <span className="text-amber-400 font-semibold">1815773</span>.
              </p>
            </div>
          </div>
        )}

        {paymentStep === 'error' && (
          <div className="py-6 space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500 text-3xl font-bold">
              ✕
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">Payment Unsuccessful</h4>
              <p className="text-xs text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl p-3 text-center">
                {errorMessage || 'Transaction was declined or cancelled.'}
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={onRetry || onCancel}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition text-sm"
              >
                Try Again
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2.5 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};