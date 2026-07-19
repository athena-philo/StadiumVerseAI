import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Bell, Sparkles, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatRelativeTime(timeStr) {
  const past = new Date(timeStr);
  const diffMs = Date.now() - past;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 minute ago";
  return `${diffMins} minutes ago`;
}

export default function LiveAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAnnouncements = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    setError('');
    
    try {
      const response = await fetch('https://stadiumverseai.onrender.com/api/announce');

if (!response.ok) {
  throw new Error('Failed to load stadium broadcasts.');
}
      const data = await response.json();
      setAnnouncements(data.announcements);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Poll for announcements updates every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchAnnouncements(true); // Silent poll update
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-10 flex flex-col gap-6 page-transition">
      
      {/* Navbar Back Home button */}
      <div className="flex justify-between items-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10 select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
        </Link>
        <button
          onClick={() => fetchAnnouncements()}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-600/30 border border-purple-500/20 hover:border-purple-500/35 px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 select-none"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="text-center relative py-6">
          {/* Header Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <span className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-400 px-3.5 py-1.5 rounded-full font-bold select-none uppercase tracking-wider">
            Live Feed
          </span>
          <h1 className="text-3xl font-black text-white mt-4 flex items-center justify-center gap-2">
            <Megaphone className="h-8 w-8 text-purple-400 animate-float" />
            Live Announcements
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
            Stay updated with real-time stadium notifications, concession wait times, and transportation clearance alerts.
          </p>
        </div>

        <div className="h-[1px] bg-white/5 my-2"></div>

        {/* Error box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-4 text-xs font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Announcements List container */}
        <div className="flex flex-col gap-4">
          
          {announcements.length > 0 ? (
            announcements.map((ann) => {
              // Extract prefix emoji if present for a clean card design
              const emojiMatch = ann.text.match(/^([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);
              let renderEmoji = "📢";
              let cleanText = ann.text;

              if (emojiMatch) {
                renderEmoji = emojiMatch[1];
                cleanText = emojiMatch[2];
              }

              return (
                <div
                  key={ann.id}
                  className="glassmorphism border border-white/10 rounded-2xl p-4.5 flex gap-4 items-start shadow-xl transition-all hover:scale-[1.01] active:scale-100 hover:bg-white/5 animate-in slide-in-from-top-4 duration-500 select-none"
                >
                  {/* Emoji Avatar */}
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-xl shadow-inner">
                    {renderEmoji}
                  </div>

                  <div className="flex-grow flex flex-col gap-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-200 leading-relaxed">
                      {cleanText}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatRelativeTime(ann.time)}</span>
                    </div>
                  </div>

                  {/* Bell status highlight */}
                  <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-gray-600 select-none">
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })
          ) : (
            !isRefreshing && !error && (
              <div className="glassmorphism border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3">
                <Sparkles className="h-10 w-10 text-gray-600 animate-pulse" />
                <h4 className="text-sm font-bold text-white">Connecting to PA Feed</h4>
                <p className="text-xs text-gray-500 mt-0.5">Awaiting live broadcasts from Arena Control room...</p>
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
