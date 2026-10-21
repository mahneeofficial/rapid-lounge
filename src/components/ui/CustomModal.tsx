import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert';
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  title,
  message,
  type = 'alert',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 text-xl font-bold">
          ⚠️
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">{title}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onCancel}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};