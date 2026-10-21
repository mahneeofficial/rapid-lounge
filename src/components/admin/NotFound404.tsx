import React from 'react';

interface NotFound404Props {
  onBackHome: () => void;
}

export const NotFound404: React.FC<NotFound404Props> = ({ onBackHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center text-amber-500 font-mono text-3xl font-extrabold shadow-2xl">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-serif font-extrabold text-white">Page Not Found</h2>
        <p className="text-xs text-zinc-500">
          The page or route you are looking for does not exist or has been moved to a different location.
        </p>
      </div>
      <button
        onClick={onBackHome}
        className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/10"
      >
        Return to Home Page
      </button>
    </div>
  );
};