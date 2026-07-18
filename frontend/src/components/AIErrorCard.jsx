import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

const AIErrorCard = React.memo(function AIErrorCard({ onRetry, onCancel, errorText }) {
  const displayMessage = errorText || "The AI service is temporarily unavailable. Please try again in a few moments.";

  return (
    <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4.5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 shadow-lg shadow-red-950/20 max-w-md w-full mx-auto my-3 relative overflow-hidden">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex gap-3 items-start">
        <div className="h-8 w-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 select-none">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">Connection Failure</h4>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {displayMessage}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-1 border-t border-white/5 pt-3.5">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 select-none active:scale-95"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500/30 hover:border-red-400/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-500/10 select-none active:scale-95 animate-pulse hover:animate-none"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Now
        </button>
      </div>

    </div>
  );
});

export default AIErrorCard;
