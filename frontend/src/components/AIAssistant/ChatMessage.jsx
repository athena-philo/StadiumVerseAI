import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, User, MapPin, Utensils, Users, ShieldAlert } from 'lucide-react';

function getCardStyles(text) {
  const query = text.toLowerCase();
  
  // Emergency (Red)
  if (query.includes('emergency') || query.includes('safety') || query.includes('first aid') || query.includes('medical') || query.includes('fire') || query.includes('smoke') || query.includes('security') || query.includes('marshall') || query.includes('escape') || query.includes('hazard') || query.includes('alert') || query.includes('steward')) {
    return {
      type: 'emergency',
      colorClass: 'border-red-500/20 bg-red-950/15 hover:border-red-500/40 text-red-400',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10 border-red-500/25'
    };
  }
  // Food & Drink (Green)
  if (query.includes('food') || query.includes('drink') || query.includes('grill') || query.includes('cafe') || query.includes('burger') || query.includes('stall') || query.includes('concession') || query.includes('dietary') || query.includes('vegetarian') || query.includes('vegan') || query.includes('halal') || query.includes('gluten') || query.includes('snack')) {
    return {
      type: 'food',
      colorClass: 'border-emerald-500/20 bg-emerald-950/15 hover:border-emerald-500/40 text-emerald-400',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/25'
    };
  }
  // Crowd & Queues (Orange)
  if (query.includes('crowd') || query.includes('queue') || query.includes('wait time') || query.includes('line') || query.includes('congested') || query.includes('minutes') || query.includes('busy') || query.includes('occupancy')) {
    return {
      type: 'crowd',
      colorClass: 'border-amber-500/20 bg-amber-950/15 hover:border-amber-500/40 text-amber-400',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/25'
    };
  }
  // Navigation & Seats (Blue)
  if (query.includes('gate') || query.includes('route') || query.includes('path') || query.includes('walking') || query.includes('navigation') || query.includes('section') || query.includes('escalator') || query.includes('elevator') || query.includes('seat') || query.includes('exit') || query.includes('concourse')) {
    return {
      type: 'navigation',
      colorClass: 'border-blue-500/20 bg-blue-950/15 hover:border-blue-500/40 text-blue-400',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/25'
    };
  }
  
  // Default: AI Tips (Purple)
  return {
    type: 'tip',
    colorClass: 'border-purple-500/20 bg-purple-950/15 hover:border-purple-500/40 text-purple-400',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/25'
  };
}

function getCardIcon(type) {
  if (type === 'emergency') return ShieldAlert;
  if (type === 'food') return Utensils;
  if (type === 'crowd') return Users;
  if (type === 'navigation') return MapPin;
  return Sparkles; // Default for tip
}

// Safe local custom markdown format helper
function formatMarkdown(text) {
  if (!text) return '';
  
  const lines = text.split('\n');
  
  return lines.map((line, lineIdx) => {
    let content = line.trim();
    if (!content) return <div key={lineIdx} className="h-2"></div>;

    // Check if the line looks like a bullet list item or step
    const listMatch = content.match(/^(?:\d+\.|\-|\*|\u2022)\s*\*\*(.*?)\*\*(?:\s*:\s*|\s+)(.*)$/i);
    const plainBulletMatch = !listMatch && content.match(/^(?:\d+\.|\-|\*|\u2022)\s*(.*)$/);

    if (listMatch) {
      const title = listMatch[1];
      const description = listMatch[2];
      const styles = getCardStyles(line);
      const Icon = getCardIcon(styles.type);
      
      const descParts = description.split('**');
      const renderedDesc = descParts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-extrabold text-white">{part}</strong>;
        }
        return part;
      });

      return (
        <div 
          key={lineIdx} 
          className={`border rounded-2xl p-4 flex gap-3.5 items-start transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg my-3 select-none hover:bg-white/5 ${styles.colorClass}`}
        >
          <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border text-xs font-semibold ${styles.iconBg}`}>
            <Icon className={`h-4.5 w-4.5 ${styles.iconColor}`} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              {title}
            </h5>
            <p className="text-xs text-gray-300 leading-relaxed font-semibold">
              {renderedDesc}
            </p>
          </div>
        </div>
      );
    }

    if (plainBulletMatch) {
      const description = plainBulletMatch[1];
      const styles = getCardStyles(line);
      const Icon = getCardIcon(styles.type);
      
      const descParts = description.split('**');
      const renderedDesc = descParts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-extrabold text-white">{part}</strong>;
        }
        return part;
      });

      return (
        <div 
          key={lineIdx} 
          className={`border rounded-2xl p-4 flex gap-3.5 items-start transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg my-3 select-none hover:bg-white/5 ${styles.colorClass}`}
        >
          <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border text-xs font-semibold ${styles.iconBg}`}>
            <Icon className={`h-4.5 w-4.5 ${styles.iconColor}`} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-white">
              Recommendation
            </h5>
            <p className="text-xs text-gray-300 leading-relaxed font-semibold">
              {renderedDesc}
            </p>
          </div>
        </div>
      );
    }

    // Check for headers (e.g. ### Header)
    const isHeader = content.startsWith('###');
    if (isHeader) {
      const headerText = content.replace(/^###\s*/, '');
      const parts = headerText.split('**');
      const renderedHeader = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return <strong key={partIdx} className="font-extrabold text-white">{part}</strong>;
        }
        return part;
      });
      return (
        <h4 key={lineIdx} className="text-xs font-extrabold text-purple-300 mt-4 mb-1 uppercase tracking-wider select-none">
          {renderedHeader}
        </h4>
      );
    }

    // Standard text lines
    const parts = content.split('**');
    const renderedLine = parts.map((part, partIdx) => {
      if (partIdx % 2 === 1) {
        return <strong key={partIdx} className="font-extrabold text-white">{part}</strong>;
      }
      return part;
    });

    return <div key={lineIdx} className="min-h-[1.2rem] text-gray-300 font-medium my-0.5">{renderedLine}</div>;
  });
}

const ChatMessage = React.memo(function ChatMessage({ message }) {
  const isUser = message.sender === 'user';
  const bubbleRef = useRef(null);
  
  const shouldAnimate = !isUser && message.text && message.animate === true;
  const [isTypingAnimationActive, setIsTypingAnimationActive] = useState(shouldAnimate);
  const [displayText, setDisplayText] = useState(shouldAnimate ? '' : message.text);

  useEffect(() => {
    if (!isTypingAnimationActive) {
      setDisplayText(message.text);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 25;
      
      if (currentIndex >= message.text.length) {
        setDisplayText(message.text);
        setIsTypingAnimationActive(false);
        clearInterval(interval);
      } else {
        setDisplayText(message.text.substring(0, currentIndex));
      }
      
      if (bubbleRef.current && message.animate !== false) {
        const parent = bubbleRef.current.closest('.overflow-y-auto');
        if (parent) {
          parent.scrollTop = parent.scrollHeight;
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [message.text, isTypingAnimationActive, message.animate]);

  useEffect(() => {
    if (message.animate === false) return;
    if (bubbleRef.current) {
      const parent = bubbleRef.current.closest('.overflow-y-auto');
      if (parent) {
        parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [displayText, message.animate]);

  return (
    <div 
      ref={bubbleRef}
      className={`flex gap-3 max-w-[85%] ${
        isUser 
          ? 'self-end flex-row-reverse animate-in slide-in-from-right-3 duration-300' 
          : 'self-start animate-in slide-in-from-left-3 duration-300'
      }`}
    >
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold shadow-md ${
        isUser 
          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' 
          : 'bg-[#151125] border border-purple-500/30 text-purple-400'
      }`}>
        {isUser ? <User className="h-4.5 w-4.5" /> : <Sparkles className="h-4 w-4" />}
      </div>
      
      {/* Bubble */}
      <div className={`flex flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-none'
          : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
      }`}>
        <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider select-none">
          {isUser ? 'You' : 'Stadium Assistant'}
        </span>
        
        <div className="whitespace-pre-wrap font-medium">
          {isUser ? displayText : formatMarkdown(displayText)}
        </div>

        {/* Skip button for typing reveal */}
        {isTypingAnimationActive && (
          <button 
            type="button"
            onClick={() => {
              setIsTypingAnimationActive(false);
              setDisplayText(message.text);
            }}
            className="text-[10px] text-purple-400 hover:text-purple-300 font-bold underline mt-1.5 cursor-pointer block select-none self-start"
          >
            Show Full Response
          </button>
        )}

        <span className="text-[9px] opacity-40 self-end mt-1 select-none">
          {message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
});

export default ChatMessage;
