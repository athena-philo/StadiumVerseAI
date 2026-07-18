import React, { useRef, useEffect, useState } from 'react';
import { X, Send, Sparkles, Sliders } from 'lucide-react';
import ChatMessage from './ChatMessage';
import AILoader from '../AILoader';
import AIErrorCard from '../AIErrorCard';

export default function AIAssistantPanel({ 
  onClose, 
  messages, 
  onSendMessage, 
  onChipClick,
  chatInput, 
  setChatInput, 
  isTyping,
  preferences,
  onTogglePreference,
  hasError,
  onRetry,
  onCancel
}) {
  const [showPrefs, setShowPrefs] = useState(false);
  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Auto scroll to bottom when a new message is added or typing starts
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  const suggestChips = [
    "🗺️ Guide me from Gate A to Seat B12.",
    "🚻 Where is the nearest restroom?",
    "🍔 Which food stall has the shortest queue?",
    "🔊 Translate stadium announcement.",
    "📅 Plan my match day from arrival.",
    "⚠️ What should I do in an emergency?"
  ];

  return (
    <div className="fixed bottom-24 right-6 w-[92vw] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl glassmorphism border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Stadium Companion AI</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Online & Interactive</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => !isTyping && setShowPrefs(!showPrefs)}
            disabled={isTyping}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              showPrefs 
                ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' 
                : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'
            }`}
            title="Companion Preferences"
          >
            <Sliders className="h-4 w-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preferences Drawer */}
      {showPrefs && (
        <div className="bg-[#0b0816]/90 border-b border-white/5 p-4 flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200 shrink-0 relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Dietary Preferences</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['vegetarian', 'vegan', 'halal', 'glutenFree'].map((key) => (
              <button
                key={key}
                disabled={isTyping}
                onClick={() => onTogglePreference(key)}
                className={`px-2.5 py-2 rounded-lg border text-left text-[10px] font-semibold transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  preferences[key] 
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' 
                    : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <span className="capitalize">{key === 'glutenFree' ? 'Gluten-Free' : key}</span>
                <span>{preferences[key] ? '✓' : ''}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Service Options</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { key: 'wheelchairAccessible', label: 'Wheelchair ♿' },
              { key: 'familyFriendly', label: 'Family 👨‍👩‍👧' },
              { key: 'kidFriendly', label: 'Kids 🎈' },
              { key: 'budgetFriendly', label: 'Budget 💸' }
            ].map((item) => (
              <button
                key={item.key}
                disabled={isTyping}
                onClick={() => onTogglePreference(item.key)}
                className={`px-2.5 py-2 rounded-lg border text-left text-[10px] font-semibold transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  preferences[item.key] 
                    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' 
                    : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                <span>{preferences[item.key] ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Chat log */}
      <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto bg-black/40 flex flex-col gap-4 scrollbar-thin">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start animate-pulse">
            <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center bg-[#151125] border border-purple-500/30 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"></span>
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        {hasError && (
          <div className="py-2 shrink-0">
            <AIErrorCard onRetry={onRetry} onCancel={onCancel} />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts container */}
      <div className="px-4 py-2 bg-[#0d0a18]/45 border-t border-white/5 shrink-0">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 select-none">Quick Suggestions</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {suggestChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onChipClick(chip)}
              disabled={isTyping}
              className="text-[11px] bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/30 rounded-full px-3 py-1.5 font-medium text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-[#0a0714] flex gap-2 shrink-0">
        <input 
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about queues, seats, planner..."
          disabled={isTyping}
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 transition-colors placeholder:text-gray-500 text-white"
        />
        <button
          type="submit"
          disabled={isTyping || !chatInput.trim()}
          className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:scale-100"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
      
      <AILoader isLoading={isTyping} />
    </div>
  );
}
