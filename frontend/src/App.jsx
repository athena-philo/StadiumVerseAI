import React, { useState, useEffect, Suspense } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Menu, X, ArrowLeft, ChevronDown, Compass, Users, Languages, Volume2, BarChart3, Mic } from 'lucide-react'
import AIAssistant from './components/AIAssistant'
const StadiumMap = React.lazy(() => import('./components/Navigation/StadiumMap'));
const CrowdIntelligence = React.lazy(() => import('./components/Crowd/CrowdIntelligence'));
const HomeView = React.lazy(() => import('./components/Pages/HomeView'));
const ComingSoon = React.lazy(() => import('./components/Pages/ComingSoon'));
const AIAssistantPage = React.lazy(() => import('./components/Pages/AIAssistantPage'));
const MatchPlanner = React.lazy(() => import('./components/Planner/MatchPlanner'));
const MultilingualSupport = React.lazy(() => import('./components/Multilingual/MultilingualSupport'));
const EmergencyAssistant = React.lazy(() => import('./components/Emergency/EmergencyAssistant'));
const LiveAnnouncements = React.lazy(() => import('./components/Announcements/LiveAnnouncements'));
const VoiceAssistant = React.lazy(() => import('./components/Voice/VoiceAssistant'));

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mapSource, setMapSource] = useState('')
  const [mapDestination, setMapDestination] = useState('')
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (source, destination) => {
    setMapSource(source);
    setMapDestination(destination);
    navigate('/navigation');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavLinkClass = (path) => {
    const base = "text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-all px-2.5 py-2 rounded-lg border ";
    if (isActive(path)) {
      return base + "text-purple-400 bg-white/5 border-purple-500/20 shadow-md shadow-purple-500/5";
    }
    return base + "text-gray-400 hover:text-white hover:bg-white/5 border-transparent";
  };

  const getMobileNavLinkClass = (path) => {
    const base = "block px-4 py-3 rounded-xl text-sm font-semibold transition-all border ";
    if (isActive(path)) {
      return base + "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }
    return base + "text-gray-300 hover:text-white hover:bg-white/5 border-transparent";
  };

  // Scroll to hash elements smoothly across routes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#050409] text-gray-100 antialiased selection:bg-purple-600 selection:text-white">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-blue-600/10 rounded-full glow-blur -translate-y-1/2 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute top-[20%] right-1/4 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-purple-700/15 rounded-full glow-blur animate-float pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-1/10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full glow-blur animate-pulse-slow pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/5 transition-all">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-float-delayed">
              <Sparkles className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-xl xl:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              StadiumVerse<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-black">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link to="/" className={getNavLinkClass('/')}>Home</Link>
            
            {/* Features Dropdown Link */}
            <div 
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button 
                type="button"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-all px-3 py-2 rounded-lg border cursor-pointer select-none flex items-center gap-1 ${
                  ['/navigation', '/crowd', '/multilingual', '/announcements', '/voice'].some(path => location.pathname === path)
                    ? 'text-purple-400 bg-white/5 border-purple-500/20 shadow-md shadow-purple-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                Features
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 rounded-2xl glassmorphism border border-white/10 p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 flex flex-col gap-0.5">
                  <Link 
                    to="/navigation" 
                    onClick={() => setFeaturesOpen(false)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all ${
                      location.pathname === '/navigation' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'
                    }`}
                  >
                    <Compass className="h-4 w-4 text-blue-400 shrink-0" />
                    Smart Navigation
                  </Link>
                  <Link 
                    to="/crowd" 
                    onClick={() => setFeaturesOpen(false)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all ${
                      location.pathname === '/crowd' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'
                    }`}
                  >
                    <Users className="h-4 w-4 text-purple-400 shrink-0" />
                    Crowd Info
                  </Link>
                  <Link 
                    to="/multilingual" 
                    onClick={() => setFeaturesOpen(false)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all ${
                      location.pathname === '/multilingual' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'
                    }`}
                  >
                    <Languages className="h-4 w-4 text-teal-400 shrink-0" />
                    Multilingual Support
                  </Link>
                  <Link 
                    to="/announcements" 
                    onClick={() => setFeaturesOpen(false)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all ${
                      location.pathname === '/announcements' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'
                    }`}
                  >
                    <Volume2 className="h-4 w-4 text-pink-400 shrink-0" />
                    Announcements
                  </Link>
                  <Link 
                    to="/voice" 
                    onClick={() => setFeaturesOpen(false)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all ${
                      location.pathname === '/voice' ? 'text-purple-400 bg-purple-500/5' : 'text-gray-400'
                    }`}
                  >
                    <Mic className="h-4 w-4 text-red-400 shrink-0" />
                    Voice Assistant
                  </Link>
                </div>
              )}
            </div>

            <Link to="/assistant" className={getNavLinkClass('/assistant')}>AI Assistant</Link>
            <Link to="/planner" className={getNavLinkClass('/planner')}>Match Planner</Link>
            <Link to="/emergency" className={getNavLinkClass('/emergency')}>Emergency</Link>
          </div>
 
          {/* Call to Action Button */}
          <div className="hidden xl:flex items-center shrink-0">
            <Link 
              to="/assistant"
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500 active:scale-95 transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl transition duration-300 group-hover:scale-105"></span>
              <span className="relative block px-5 py-2.5 rounded-xl bg-[#0c0a18] text-xs font-bold uppercase tracking-wider text-white transition duration-200 group-hover:bg-[#0c0a18]/80">
                Get Started
              </span>
            </Link>
          </div>

          {/* Hamburger Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glassmorphism border-b border-white/5 animate-in fade-in slide-in-from-top-5 duration-300 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/')}>Home</Link>
              <Link to="/assistant" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/assistant')}>AI Assistant</Link>
              <Link to="/planner" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/planner')}>Match Planner</Link>
              <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/emergency')}>Emergency Assistance</Link>
              
              <div className="border-t border-white/5 pt-2 mt-2">
                <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest px-4 mb-1 block">Features</span>
                <div className="pl-3 space-y-0.5">
                  <Link to="/navigation" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/navigation')}>Smart Navigation</Link>
                  <Link to="/crowd" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/crowd')}>Crowd Intelligence</Link>
                  <Link to="/multilingual" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/multilingual')}>Multilingual Support</Link>
                  <Link to="/announcements" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/announcements')}>Announcements</Link>
                  <Link to="/voice" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass('/voice')}>AI Voice Assistant</Link>
                </div>
              </div>

              <div className="pt-3">
                <Link 
                  to="/assistant" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xs uppercase tracking-wider text-white block hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Routed Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <Suspense fallback={
          <div className="min-h-[450px] flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-xs text-purple-400 font-bold tracking-widest uppercase">Loading StadiumVerse...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/navigation" element={
              <div className="py-10 flex flex-col gap-6 page-transition">
                <div>
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
                  </Link>
                </div>
                <StadiumMap 
                  source={mapSource} 
                  destination={mapDestination} 
                  setSource={setMapSource} 
                  setDestination={setMapDestination} 
                />
              </div>
            } />
            <Route path="/crowd" element={
              <div className="py-10 flex flex-col gap-6">
                <div>
                  <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
                  </Link>
                </div>
                <CrowdIntelligence />
              </div>
            } />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/planner" element={<MatchPlanner />} />
            <Route path="/emergency" element={<EmergencyAssistant />} />
            <Route path="/multilingual" element={<MultilingualSupport />} />
            <Route path="/announcements" element={<LiveAnnouncements />} />
            <Route path="/voice" element={<VoiceAssistant />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030206] py-12 text-gray-500 text-xs mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-extrabold text-gray-300">StadiumVerseAI</span>
          </div>
          <div className="flex gap-4 xl:gap-6">
            <Link to="/#features" className="hover:text-gray-300 transition-colors">Features</Link>
            <Link to="/navigation" className="hover:text-gray-300 transition-colors">Map</Link>
            <Link to="/crowd" className="hover:text-gray-300 transition-colors">Crowd Info</Link>
            <a href="https://github.com" target="_blank" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
          <div>
            <span>&copy; 2026 StadiumVerseAI. Built with premium web aesthetics.</span>
          </div>
        </div>
      </footer>

      <AIAssistant onNavigate={handleNavigate} />
    </div>
  )
}

export default App
