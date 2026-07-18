import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Ticket, ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatMessage from '../AIAssistant/ChatMessage';
import AILoader from '../AILoader';
import AIErrorCard from '../AIErrorCard';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Welcome to your dedicated Stadium Assistant console. 🏟️\nAsk me about queue status updates, restroom locations, navigation steps, event timetables, or hazard reports.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      animate: false
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastInput, setLastInput] = useState('');
  const [hasError, setHasError] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [scoreboardScore, setScoreboardScore] = useState('0 - 0');
  const [scoreboardTime, setScoreboardTime] = useState("First Half (0' min)");
  const chatEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  const [preferences, setPreferences] = useState({
    vegetarian: false,
    vegan: false,
    halal: false,
    glutenFree: false,
    wheelchairAccessible: false,
    familyFriendly: false,
    kidFriendly: false,
    budgetFriendly: false
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Proactive Alerts monitoring
  useEffect(() => {
    const fetchProactiveAlerts = async () => {
      try {
        const response = await fetch('/api/chat/proactive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            seat: 'Section 102, Row E, Seat 24B',
            gate: 'Gate A',
            preferences,
            history: messages
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.alerts)) {
            setAlerts(data.alerts);
          }
        }
      } catch (err) {
        console.error("Proactive alerts poll error:", err);
      }
    };

    fetchProactiveAlerts();
    const interval = setInterval(fetchProactiveAlerts, 15000);
    return () => clearInterval(interval);
  }, [preferences, messages]);

  // Match Insights monitoring
  useEffect(() => {
    const fetchMatchInsights = async () => {
      try {
        const response = await fetch('/api/chat/match-insights');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.insights)) {
            setInsights(data.insights);
            setScoreboardScore(data.score);
            const period = data.minute <= 45 ? 'First Half' : 'Second Half';
            setScoreboardTime(`${period} (${data.minute}' min elapsed)`);
          }
        }
      } catch (err) {
        console.error("Match insights poll error:", err);
      }
    };

    fetchMatchInsights();
    const interval = setInterval(fetchMatchInsights, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const handleSendMessage = async (text) => {
    setLastInput(text);
    setHasError(false);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text, time: timestamp };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, preferences, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI Assistant backend');
      }

      const data = await response.json();
      const aiMsg = { 
        sender: 'ai', 
        text: data.reply, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        animate: true
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setHasError(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    handleSendMessage(chatInput.trim());
    setChatInput('');
  };

  const chips = [
    "🍔 Live concession line wait times?",
    "🗺️ Guide me from Gate A to Seat B12.",
    "🚻 Where is Section 102 restroom?",
    "📅 Plan my arrival program."
  ];

  return (
    <div className="py-12 page-transition">
      
      {/* Return button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Mock Seating/Match Context Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="h-5 w-5 text-indigo-400" />
              Registered Event Pass
            </h3>

            {/* Ticket Info */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Event Arena</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">StadiumVerse Arena</h4>
                </div>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold select-none">Active</span>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Section</span>
                  <p className="text-sm font-bold text-white mt-0.5">102</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Row</span>
                  <p className="text-sm font-bold text-white mt-0.5">E</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Seat</span>
                  <p className="text-sm font-bold text-white mt-0.5">24B</p>
                </div>
              </div>
            </div>

            {/* Live game status */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-extrabold text-sm select-none">
                VS
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Live Scoreboard</span>
                <h4 className="text-xs font-bold text-white mt-0.5">StadiumVerse FC {scoreboardScore} United SC</h4>
                <span className="text-[9px] text-purple-400 mt-1 inline-block">{scoreboardTime}</span>
              </div>
            </div>
          </div>

          {/* Proactive Smart Alerts */}
          <div className="glassmorphism border border-purple-500/20 bg-purple-950/5 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Proactive AI Assistant
            </h3>
            
            <div className="flex flex-col gap-3">
              {alerts.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No warnings or suggestions at this moment. Monitoring live crowd conditions...</p>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all flex flex-col gap-1 text-[11px] font-medium leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-white flex items-center gap-1.5">{alert.title}</span>
                      <span className="text-[9px] text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-gray-400 leading-normal">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Match Insights */}
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-blue-400" />
              AI Match Insights
            </h3>
            
            <div className="flex flex-col gap-3.5">
              {insights.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No insights compiled. Reading live pitch metrics...</p>
              ) : (
                insights.map(ins => (
                  <div key={ins.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all flex flex-col gap-1 text-[11px] font-medium leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-white flex items-center gap-1.5">{ins.title}</span>
                      <span className="text-[9px] text-blue-400 font-bold">{ins.timestamp}</span>
                    </div>
                    <p className="text-gray-400 leading-normal">{ins.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preferences Settings Card */}
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-purple-400" />
              Companion Preferences
            </h3>
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Dietary Options</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(preferences).slice(0, 4).map((key) => (
                  <button
                    key={key}
                    disabled={isTyping}
                    onClick={() => togglePreference(key)}
                    className={`px-3 py-2.5 rounded-xl text-left border transition-all text-[11px] font-bold select-none flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      preferences[key] 
                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/35' 
                        : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="capitalize">{key === 'glutenFree' ? 'Gluten-Free' : key}</span>
                    <span>{preferences[key] ? '✓' : ''}</span>
                  </button>
                ))}
              </div>

              <div className="h-[1px] bg-white/5 my-1"></div>

              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Accessibility & Budget</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'wheelchairAccessible', label: 'Wheelchair ♿' },
                  { key: 'familyFriendly', label: 'Family 👨‍👩‍👧' },
                  { key: 'kidFriendly', label: 'Kids 🎈' },
                  { key: 'budgetFriendly', label: 'Budget 💸' }
                ].map((item) => (
                  <button
                    key={item.key}
                    disabled={isTyping}
                    onClick={() => togglePreference(item.key)}
                    className={`px-3 py-2.5 rounded-xl text-left border transition-all text-[11px] font-bold select-none flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      preferences[item.key] 
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/35' 
                        : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span>{preferences[item.key] ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Help box */}
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 text-xs text-gray-400 flex flex-col gap-3 shadow-md">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-blue-400" /> Quick Commands
            </h4>
            <p>Your companion handles complex context queries. For example, try telling the chat:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>"Where is the nearest restroom?"</li>
              <li>"Which food queue is shortest?"</li>
              <li>"Safety issue at Section 102!"</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Large Chat Panel */}
        <div className="lg:col-span-8 glassmorphism border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[500px] max-h-[70vh] overflow-hidden">
          
          {/* Header */}
          <div className="pb-4 border-b border-white/5 flex justify-between items-center bg-black/10 px-3 py-2.5 rounded-xl mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white tracking-wide uppercase">AI Companion Feed</h3>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold select-none">Live Connection</span>
          </div>

          {/* Messages */}
          <div ref={scrollContainerRef} className="flex-grow overflow-y-auto px-1 py-2 flex flex-col gap-4 scrollbar-thin">
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
              <div className="py-2">
                <AIErrorCard 
                  onRetry={() => handleSendMessage(lastInput)}
                  onCancel={() => {
                    setHasError(false);
                    setChatInput(lastInput);
                  }}
                />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="mt-4 border-t border-white/5 pt-3">
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim())}
                  disabled={isTyping}
                  className="text-[11px] bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/30 rounded-full px-3 py-1.5 font-medium text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about live crowd queue status or seat routes..."
              disabled={isTyping}
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 transition-colors text-gray-100 placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="h-11 px-5 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer disabled:opacity-50"
            >
              Send
            </button>
          </form>

        </div>

      </div>

      <AILoader isLoading={isTyping} />
    </div>
  );
}
