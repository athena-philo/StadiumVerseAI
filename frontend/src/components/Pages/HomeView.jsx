import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Users, 
  Calendar, 
  AlertOctagon, 
  Languages, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Shield 
} from 'lucide-react';

export default function HomeView() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [simulatedChat, setSimulatedChat] = useState([
    { sender: 'ai', text: "Hello! I am your AI Stadium Assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Demo suggestions for the simulator
  const chatChips = [
    { label: "🍔 Order food to Seat 24B", reply: "Sure thing! I can help you order from 'Stadium Bites'. Their current wait time is 5 minutes. Would you like to view the menu?" },
    { label: "🚪 Best route to Gate 4?", reply: "From your current seat in Section 102, head up the stairs to Concourse A, turn left, and walk past the fan store. Gate 4 is 2 minutes away." },
    { label: "🎟️ Show my Match Ticket", reply: "Here is your ticket for Section 102, Row E, Seat 24B. The gate is open and queue times are currently under 3 minutes!" }
  ];

  const handleChipClick = (chip) => {
    if (isTyping) return;
    
    setSimulatedChat(prev => [...prev, { sender: 'user', text: chip.label }]);
    setIsTyping(true);

    setTimeout(() => {
      setSimulatedChat(prev => [...prev, { sender: 'ai', text: chip.reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput;
    setSimulatedChat(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setSimulatedChat(prev => [...prev, {
        sender: 'ai',
        text: `I've received your message: "${userText}". The AI Assistant is temporarily unavailable due to API usage limits. Please use the interactive stadium features below to explore match planner routing, concessions, or safety alerts.`
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="page-transition relative overflow-hidden">
      {/* Premium Background Visual Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-[pulse_8s_infinite]"></div>
      <div className="absolute top-[45%] right-[-10%] w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-[pulse_10s_infinite]"></div>
      <div className="absolute bottom-[15%] left-[5%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10 animate-[pulse_12s_infinite]"></div>

      {/* Floating Particle Stars */}
      <div className="absolute top-[15%] left-[12%] w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
      <div className="absolute top-[35%] right-[15%] w-3.5 h-3.5 bg-purple-400 rounded-full animate-pulse opacity-15 pointer-events-none"></div>
      <div className="absolute top-[60%] left-[8%] w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping opacity-20 [animation-duration:3s] pointer-events-none"></div>
      <div className="absolute bottom-[25%] right-[12%] w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-25 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
        {/* Tagline Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-bold tracking-wide text-purple-200 mb-8 animate-float shadow-[0_0_15px_rgba(139,92,246,0.15)] select-none relative overflow-hidden"
          style={{
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(rgba(13, 10, 24, 0.8), rgba(13, 10, 24, 0.8)), linear-gradient(to right, #3b82f6, #a855f7)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}
        >
          <span className="animate-[spin_6s_linear_infinite] text-[13px] filter drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">🏆</span>
          <span>AI-Powered FIFA World Cup Match-Day Companion</span>
        </div>

        {/* Hero Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none -z-10"></div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none max-w-4xl mb-6">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Your AI Companion for the 
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm font-black">
            Ultimate Stadium Experience
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base font-semibold text-gray-400 max-w-3xl mb-10 leading-relaxed">
          Navigate crowded stadiums, discover the fastest food queues, receive multilingual assistance, plan your entire match day, and stay safe with an intelligent AI companion built specifically for FIFA World Cup and large live sporting events.
        </p>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto">
          <Link 
            to="/assistant"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.03] active:scale-[0.97]"
          >
            Get Started 
            <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/assistant"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl glassmorphism hover:bg-white/5 text-sm font-extrabold uppercase tracking-wider text-gray-200 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97]"
          >
            Meet the AI Assistant
          </Link>
        </div>

        {/* Glass dashboard preview card */}
        <a 
          href="#simulator" 
          className="w-full max-w-5xl rounded-3xl glassmorphism p-3 md:p-4 border border-white/10 hover:border-purple-500/30 shadow-2xl shadow-indigo-900/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] relative animate-float-delayed block cursor-pointer transition-all duration-500 group hover:scale-[1.01]"
        >
          {/* Window buttons */}
          <div className="flex items-center gap-2 px-3 pb-3 border-b border-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block"></span>
            <span className="text-xs text-gray-500 font-medium ml-4 tracking-wider uppercase">stadiumverse-app-preview.exe</span>
            
            {/* Pulsing indicator tag */}
            <span className="ml-auto inline-flex items-center gap-1.5 text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 animate-pulse uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span> Live Simulator
            </span>
          </div>
          
          <div className="rounded-2xl overflow-hidden bg-[#0a0714] aspect-[16/9] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0714]/90 z-10"></div>
            
            {/* Graphic background showing simulated dashboard */}
            <div className="grid grid-cols-12 gap-4 p-6 sm:p-8 w-full h-full opacity-30 select-none transition-opacity duration-500 group-hover:opacity-40 blur-[1px] group-hover:blur-[0.5px]">
              
              {/* Left Column: AI Assistant Chat & Emergency Assistant (col-span-4) */}
              <div className="col-span-4 flex flex-col gap-3">
                {/* AI Assistant Chat Panel */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2 relative">
                  <span className="text-[8px] text-blue-400 font-extrabold uppercase tracking-widest block">💬 AI Chat Companion</span>
                  <div className="flex flex-col gap-1.5 text-[8px] font-bold">
                    <div className="bg-[#151125] border border-purple-500/20 text-purple-300 rounded-lg p-2 max-w-[85%] self-start rounded-tl-none leading-normal">
                      Welcome! Ask me for Gate A coordinates or concession line wait times.
                    </div>
                    <div className="bg-indigo-600 text-white rounded-lg p-2 max-w-[85%] self-end rounded-tr-none leading-normal">
                      Where is the nearest first aid room?
                    </div>
                    <div className="bg-[#151125] border border-purple-500/20 text-purple-300 rounded-lg p-2 max-w-[85%] self-start rounded-tl-none leading-normal">
                      First aid is at Section 102 concourse. Quickest walk is 1m 30s.
                    </div>
                  </div>
                </div>

                {/* Emergency Assistant Panel */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-red-400 font-extrabold uppercase tracking-widest">🚨 Emergency Monitor</span>
                    <span className="bg-red-500/25 border border-red-500/40 text-red-400 text-[6px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">🔴 Critical</span>
                  </div>
                  <p className="text-[8.5px] text-gray-300 font-semibold leading-normal">
                    Concourse B congestion alert. Evacuation route plotted to Muster Zone A exits.
                  </p>
                </div>
              </div>

              {/* Center Column: Smart Stadium Map & Crowd Density (col-span-5) */}
              <div className="col-span-5 flex flex-col h-full">
                {/* Smart Stadium Map */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between flex-grow h-full relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] text-purple-400 font-extrabold uppercase tracking-widest">🗺️ Smart Stadium Map</span>
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-wider">Level 2 Concourse</span>
                  </div>
                  
                  {/* Miniature SVG Stadium map drawing */}
                  <div className="flex-grow flex items-center justify-center py-2 relative min-h-[90px]">
                    <svg viewBox="0 0 100 80" className="w-full max-h-[110px] opacity-40">
                      <ellipse cx="50" cy="40" rx="42" ry="28" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" />
                      <ellipse cx="50" cy="40" rx="30" ry="20" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" />
                      <ellipse cx="50" cy="40" rx="18" ry="11" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />
                      
                      {/* Mock Route Path */}
                      <path d="M 12 40 Q 50 15 88 40" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3,2" />
                      
                      {/* Mock Coordinates */}
                      <circle cx="12" cy="40" r="3" fill="#3b82f6" />
                      <circle cx="88" cy="40" r="3" fill="#ec4899" />
                      <circle cx="50" cy="12" r="2.5" fill="#f59e0b" />
                    </svg>
                  </div>
                  
                  {/* Crowd Density indicator */}
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[7px] font-bold text-gray-400 mt-1">
                    <span>👥 Concourse Density: <strong className="text-yellow-400">74%</strong></span>
                    <span>Queue: <strong className="text-emerald-400">Low Wait</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Column: Match Planner & Live Announcements (col-span-3) */}
              <div className="col-span-3 flex flex-col gap-3">
                {/* Match Planner Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2 relative">
                  <span className="text-[8px] text-pink-400 font-extrabold uppercase tracking-widest block">📅 Match Planner</span>
                  <div className="flex flex-col gap-1.5 text-[7.5px] font-bold text-gray-300">
                    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded">
                      <span className="text-emerald-400">✓</span>
                      <span>18:00 - Gate A check-in</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded">
                      <span className="text-emerald-400">✓</span>
                      <span>18:20 - Concession grill pickup</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 p-1 rounded text-purple-300">
                      <span className="animate-pulse">⏱</span>
                      <span>19:00 - Kickoff starts</span>
                    </div>
                  </div>
                </div>

                {/* Live Announcements widget */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2 relative">
                  <span className="text-[8px] text-teal-400 font-extrabold uppercase tracking-widest block">📢 Live PA Broadcast</span>
                  <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-[7.5px] font-bold text-gray-400 leading-normal">
                    🍔 East Concourse Grill wait time is currently under 2 mins.
                  </div>
                </div>
              </div>

            </div>

            {/* Centered Interactive Trigger */}
            <div className="absolute z-20 flex flex-col items-center gap-4 text-center px-6 max-w-xl transition-all duration-300 group-hover:scale-[1.02]">
              <div className="p-4 bg-purple-500/10 border border-purple-500/25 rounded-2xl shadow-xl shadow-purple-950/20">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Experience StadiumVerseAI in Action
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed font-semibold">
                  Interact with our AI-powered stadium companion and explore navigation, crowd intelligence, multilingual assistance, emergency guidance, and personalized match planning in real time.
                </p>
              </div>

              {/* Pulsing interactive CTA button */}
              <div className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all duration-300 relative overflow-hidden group-hover:from-blue-500 group-hover:to-purple-500 animate-[pulse_2s_infinite]">
                Explore the AI Experience
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* Why StadiumVerseAI Section */}
      <section id="features" className="py-24 border-t border-white/5 scroll-mt-20 relative">
        {/* Soft glow behind features header */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto mb-20 select-none">
          <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Value Proposition
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-5 tracking-tight">
            Why StadiumVerseAI?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-3.5 max-w-xl mx-auto leading-relaxed">
            The tournament platform built specifically to support high-density matchday environments, keeping you aligned, guided, and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: AI Match-Day Assistant */}
          <Link 
            to="/assistant" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>🤖</span> AI Match-Day Assistant
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Personalized AI guidance throughout your stadium journey.
            </p>
          </Link>

          {/* Card 2: Smart Navigation */}
          <Link 
            to="/navigation" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>🗺️</span> Smart Navigation
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Find the fastest routes to gates, seats, food courts and facilities.
            </p>
          </Link>

          {/* Card 3: Crowd Intelligence */}
          <Link 
            to="/crowd" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>👥</span> Crowd Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Avoid congestion using AI-powered crowd insights.
            </p>
          </Link>

          {/* Card 4: Match Planner */}
          <Link 
            to="/planner" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>📅</span> Personalized Match Planner
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Generate a complete itinerary based on your preferences.
            </p>
          </Link>

          {/* Card 5: Multilingual Support */}
          <Link 
            to="/multilingual" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Languages className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>🌍</span> Multilingual Support
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Translate stadium announcements instantly for international visitors.
            </p>
          </Link>

          {/* Card 6: Emergency Assistant */}
          <Link 
            to="/emergency" 
            className="glassmorphism-card rounded-3xl p-6 md:p-8 relative overflow-hidden group block cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <AlertOctagon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-2.5 flex items-center gap-2">
              <span>🚑</span> Emergency Assistant
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Receive intelligent emergency guidance with crowd-aware recommendations.
            </p>
          </Link>

        </div>
      </section>

      {/* Live Simulator Section */}
      <section id="simulator" className="py-20 border-t border-white/5 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">Interactive Showcase</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Simulate the Companion Console
          </p>
          <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
            Toggle the modules below to interact with the mock features in our virtual stadium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible shrink-0">
            <button 
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'assistant' 
                  ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-indigo-500/50 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>AI Assistant Chat</span>
            </button>

            <button 
              onClick={() => setActiveTab('queues')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'queues' 
                  ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border border-purple-500/50 text-white shadow-lg shadow-purple-600/20' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Live Wait Times</span>
            </button>

            <button 
              onClick={() => setActiveTab('navigator')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'navigator' 
                  ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 border border-pink-500/50 text-white shadow-lg shadow-pink-600/20' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>Seat Navigator</span>
            </button>

            <button 
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === 'emergency' 
                  ? 'bg-gradient-to-r from-red-600/80 to-rose-600/80 border border-rose-500/50 text-white shadow-lg shadow-rose-600/20' 
                  : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Emergency Broadcast</span>
            </button>
          </div>

          {/* Display Console Panel */}
          <div className="lg:col-span-8 glassmorphism border border-white/10 rounded-2xl p-6 min-h-[450px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-purple-600/5 rounded-full blur-2xl"></div>

            {/* Tab 1: AI Assistant Chat */}
            {activeTab === 'assistant' && (
              <div className="flex flex-col h-full justify-between gap-4 flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    Smart AI Companion Chat
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Choose a sample query chip or write a custom message to test HMR states.
                  </p>
                </div>

                <div className="flex-grow my-4 bg-black/30 border border-white/5 rounded-xl p-4 h-[250px] overflow-y-auto flex flex-col gap-3">
                  {simulatedChat.map((msg, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white self-end rounded-tr-none'
                          : 'bg-white/10 text-gray-200 self-start rounded-tl-none border border-white/5'
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">
                        {msg.sender === 'user' ? 'You' : 'Stadium AI'}
                      </span>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-white/10 text-gray-200 self-start rounded-2xl rounded-tl-none px-4 py-2.5 text-sm border border-white/5 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {chatChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      disabled={isTyping}
                      className="text-xs bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 rounded-full px-3.5 py-1.5 font-medium text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a custom query..."
                    disabled={isTyping}
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !chatInput.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold text-white shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Live Wait Times */}
            {activeTab === 'queues' && (
              <div className="flex flex-col h-full justify-between gap-4 flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-400" />
                    Live Crowd Queue Monitor
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Crowd intelligence stats fetched from simulation gate loops.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Entrance Gate A</span>
                      <h4 className="text-lg font-bold text-white mt-0.5">2 mins wait</h4>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-2">Smooth Traffic</span>
                    </div>
                    <div className="h-3 w-16 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[15%]"></div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">West Concourse Hotdogs</span>
                      <h4 className="text-lg font-bold text-yellow-400 mt-0.5">12 mins wait</h4>
                      <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full inline-block mt-2">Moderately Busy</span>
                    </div>
                    <div className="h-3 w-16 bg-yellow-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[55%]"></div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">South Fan Store</span>
                      <h4 className="text-lg font-bold text-red-400 mt-0.5">25 mins wait</h4>
                      <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full inline-block mt-2">Peak Congestion</span>
                    </div>
                    <div className="h-3 w-16 bg-red-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[90%]"></div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">North Restrooms 2</span>
                      <h4 className="text-lg font-bold text-white mt-0.5">1 min wait</h4>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-2">Clear</span>
                    </div>
                    <div className="h-3 w-16 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[8%]"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <p className="text-xs text-indigo-200">
                    <strong>AI Suggestion:</strong> West Concourse Hotdogs is currently highly congested. Walk 2 minutes to East Concourse Grill where queues are currently under 3 minutes!
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Seat Navigator */}
            {activeTab === 'navigator' && (
              <div className="flex flex-col h-full justify-between gap-4 flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    Virtual Layout Seat Locator
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Check your coordinate route from Entry Gates to seat locations.
                  </p>
                </div>

                <div className="flex-grow my-4 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px]">
                  <div className="text-center max-w-sm mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full">
                      <span>Seat Registered: Row E, Seat 24B</span>
                    </div>
                  </div>
                  
                  <div className="relative w-64 h-32 border border-purple-500/20 rounded-lg flex flex-col justify-between p-2 overflow-hidden bg-purple-900/5">
                    <div className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest border-b border-white/5 pb-1">Pitch / Action Area</div>
                    <div className="flex justify-between items-end flex-grow">
                      <div className="text-[9px] text-gray-400">Section 101</div>
                      <div className="relative">
                        <span className="absolute -top-6 -left-1 text-[10px] text-purple-400 font-bold animate-float">You</span>
                        <div className="h-3 w-3 rounded-full bg-purple-500 border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="text-[9px] text-gray-400">Section 103</div>
                    </div>
                  </div>

                  <div className="flex justify-between w-full max-w-xs mt-4 text-xs text-gray-400">
                    <span>Gate 2 (Entrance)</span>
                    <span className="text-purple-400">➜ 2 min route ➜</span>
                    <span>Section 102, Row E</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 cursor-pointer">
                    View full 3D Arena Map
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Emergency Assistance */}
            {activeTab === 'emergency' && (
              <div className="flex flex-col h-full justify-between gap-4 flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Critical Dispatch Console
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Direct alerts to first aid coordinates and crowd control operations.
                  </p>
                </div>

                <div className="my-6 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-center">
                  <AlertOctagon className="h-12 w-12 text-red-500 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-md font-bold text-white">Emergency Assistance Trigger</h4>
                  <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                    In case of injury, fire, or hazards, pressing this button immediately locks your GPS seat coordinates and alerts nearby stewards.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => alert("SOS Emergency Beacon Triggered. Medical responders and safety marshals have been dispatched to Section 102, Row E, Seat B12.")}
                    className="flex-grow py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-sm font-bold text-white shadow-lg shadow-red-600/20 cursor-pointer hover:scale-[1.01] transition-transform"
                  >
                    ⚠️ Broadcast SOS to Dispatch
                  </button>
                  <button className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 cursor-pointer">
                    Find First Aid Station
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why StadiumVerseAI? Section */}
      <section id="why-us" className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">Product Value</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Why StadiumVerseAI?
          </p>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Redefining live arena experiences by connecting fans with intelligent digital systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: AI-Powered Match-Day Companion */}
          <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Powered Match-Day Companion</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Personalized assistance using Google Gemini. Locate match programs, resolve custom arena queries, and get conversational guidance.
            </p>
          </div>

          {/* Card 2: Smart Stadium Navigation */}
          <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Stadium Navigation</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fastest routes to seats, food courts, restrooms, and exits. Easily visualize walking paths and bypass arena bottlenecks.
            </p>
          </div>

          {/* Card 3: Crowd Intelligence */}
          <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Crowd Intelligence</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Live crowd density and queue predictions for better decisions. Monitor turnstiles and concession stands to save time.
            </p>
          </div>

          {/* Card 4: Multilingual & Emergency Support */}
          <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multilingual & Emergency Support</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Real-time translation and instant emergency guidance. Access multi-language transcripts and secure dispatch coordinates.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a 
            href="#simulator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Try StadiumVerseAI Now
            <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 relative overflow-hidden rounded-3xl glassmorphism border border-white/10 my-20 p-8 md:p-12 text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight max-w-2xl leading-tight">
          Ready to Redefine Your Live Arena Experience?
        </h2>
        <p className="text-base text-gray-400 mt-4 max-w-xl leading-relaxed">
          StadiumVerseAI is customizable for stadiums, concert halls, and large-scale convention centers. Experience the premium standard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/assistant"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
          >
            Launch Live Companion
          </Link>
          <a 
            href="mailto:contact@stadiumverse.ai"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-gray-300 cursor-pointer"
          >
            Contact Operations
          </a>
        </div>
      </section>
    </div>
  );
}
