import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ComingSoon({ featureName }) {
  return (
    <div className="py-8 animate-in fade-in duration-300 flex flex-col gap-6">
      <div>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to Home
        </Link>
      </div>

      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="glassmorphism border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg shadow-2xl relative overflow-hidden w-full">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 mx-auto animate-float">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            {featureName}
          </h2>
          <div className="inline-block">
            <span className="text-xs bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-full px-3 py-1 font-bold uppercase tracking-wider select-none">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-6 mb-8 leading-relaxed">
            We are currently building this smart arena companion module. IoT integrations and live stadium database hooks are in progress. Stay tuned!
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-semibold text-gray-200 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
