import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function AIAssistantButton({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle AI Assistant Chat"
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-300 z-50 cursor-pointer group`}
    >
      {/* Outer pulsating rings */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 opacity-40 animate-ping group-hover:animate-none"></span>
      <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-20 animate-pulse"></span>
      
      {/* Icon */}
      {isOpen ? (
        <Sparkles className="h-6 w-6 animate-spin-slow" />
      ) : (
        <MessageSquare className="h-6 w-6" />
      )}
    </button>
  );
}
