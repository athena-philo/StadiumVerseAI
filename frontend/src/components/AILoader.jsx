import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AILoader({ isLoading }) {
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "🤖 StadiumVerseAI is analyzing your request...",
    "🧠 Understanding your question...",
    "🗺️ Checking stadium information...",
    "👥 Analyzing crowd conditions...",
    "⚡ Generating your personalized response..."
  ];

  useEffect(() => {
    if (!isLoading) return;
    
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glassmorphism border border-white/10 rounded-3xl p-8 max-w-sm w-[90%] text-center shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Glowing backdrop elements */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Dynamic Rotating Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing center icon */}
          <div className="absolute h-10 w-10 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          {/* Rotating gradient ring */}
          <div className="h-20 w-20 border-4 border-transparent border-t-purple-500 border-l-blue-500 border-r-purple-600 rounded-full animate-spin [animation-duration:1.2s]"></div>
        </div>

        {/* Rotating text content */}
        <div className="h-12 flex items-center justify-center px-2">
          <p className="text-sm font-bold text-gray-200 tracking-wide transition-all duration-300 animate-pulse leading-snug">
            {messages[msgIndex]}
          </p>
        </div>
        
        {/* Sub-loading text */}
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
          Syncing with arena services...
        </span>

      </div>
    </div>
  );
}
