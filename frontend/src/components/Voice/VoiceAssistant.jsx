import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle,
  Info,
  HelpCircle,
  Play
} from 'lucide-react';
import AILoader from '../AILoader';

export default function VoiceAssistant() {
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [history, setHistory] = useState([]);

  // Scoped suggestions for spectators to say
  const voicePrompts = [
    "🍔 What is the shortest food queue?",
    "🗺️ Guide me from Gate A to Seat B12.",
    "🚻 Where is the nearest restroom?"
  ];

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setAiReply('');
        // Cancel existing voice output if playing
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSubmitQuery(text);
      };

      setRecognition(rec);
    } catch (err) {
      console.error(err);
      setIsSupported(false);
    }

    // Cancel synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSubmitQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    
    const userMsg = { sender: 'user', text: queryText };
    setHistory(prev => [...prev, userMsg]);
    
    try {
      const response = await fetch('https://stadiumverseai.onrender.com/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText, history })
      });

      if (!response.ok) {
        throw new Error('AI failed to compile your request.');
      }

      const data = await response.json();
      setAiReply(data.reply);
      speakAloud(data.reply);
      
      const aiMsg = { sender: 'ai', text: data.reply };
      setHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setAiReply('Sorry, I am having trouble connecting to the stadium AI assistant. Please try again.');
      speakAloud('Sorry, I am having trouble connecting to the stadium AI assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakAloud = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Remove emoji codes before synthesis for natural voice flow
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (aiReply) {
      speakAloud(aiReply);
    }
  };

  return (
    <div className="py-10 flex flex-col gap-6 page-transition">
      
      {/* Scope Style equalizers */}
      <style>{`
        @keyframes voice-wave {
          0%, 100% { height: 6px; }
          50% { height: 28px; }
        }
        .animate-voice-bar-1 { animation: voice-wave 0.8s ease-in-out infinite; }
        .animate-voice-bar-2 { animation: voice-wave 0.8s ease-in-out infinite 0.15s; }
        .animate-voice-bar-3 { animation: voice-wave 0.8s ease-in-out infinite 0.3s; }
        .animate-voice-bar-4 { animation: voice-wave 0.8s ease-in-out infinite 0.45s; }
        .animate-voice-bar-5 { animation: voice-wave 0.8s ease-in-out infinite 0.6s; }
      `}</style>

      {/* Return Home Nav Button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10 select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
        </Link>
      </div>

      <div className="max-w-xl mx-auto w-full flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="text-center relative py-6">
          {/* Header Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <span className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-400 px-3.5 py-1.5 rounded-full font-bold select-none uppercase tracking-wider">
            Hands-Free Guidance
          </span>
          <h1 className="text-3xl font-black text-white mt-4 flex items-center justify-center gap-2 select-none">
            <Sparkles className="h-8 w-8 text-purple-400 animate-float" />
            AI Voice Assistant
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto select-none">
            Speak directly to search seating directions, concession live wait times, and emergency help routes.
          </p>
        </div>

        <div className="h-[1px] bg-white/5 my-2"></div>

        {/* Browser compatibility check */}
        {!isSupported ? (
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex gap-3 items-start shadow-lg">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Browser Not Supported</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                The browser Speech Recognition API is unavailable in this environment. For best results, please load StadiumVerseAI in Google Chrome, Microsoft Edge, or Apple Safari.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Center Console Circle Wrapper */}
            <div className="glassmorphism border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative min-h-[220px]">
              
              {/* Animated Listening soundwaves */}
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="absolute h-36 w-36 rounded-full bg-purple-500/10 border border-purple-500/30 animate-ping"></span>
                  <span className="absolute h-48 w-48 rounded-full bg-purple-500/5 border border-purple-500/15 animate-ping [animation-delay:0.3s]"></span>
                </div>
              )}

              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                className={`h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10 cursor-pointer shadow-xl ${
                  isListening 
                    ? 'bg-red-500 border-red-400 text-white animate-pulse'
                    : 'bg-gradient-to-tr from-purple-600 to-blue-600 border-purple-400 text-purple-100 hover:scale-105 active:scale-95'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10 animate-bounce" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </button>

              <span className="text-xs font-extrabold mt-6 text-gray-300 tracking-widest uppercase animate-pulse select-none">
                {isListening ? 'Listening... Speak Now' : 'Tap Microphone to Speak'}
              </span>

            </div>

            {/* Suggestions list */}
            {!transcript && !aiReply && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Try Saying</span>
                {voicePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(p.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim());
                      handleSubmitQuery(p.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim());
                    }}
                    disabled={isLoading || isListening}
                    className="w-full text-left text-xs bg-white/5 hover:bg-purple-600/25 border border-white/5 hover:border-purple-500/20 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold text-gray-300 hover:text-white flex items-center justify-between group disabled:opacity-50 select-none"
                  >
                    <span>{p}</span>
                    <Play className="h-3 w-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* User Speech Transcription Card */}
            {transcript && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 flex flex-col gap-1.5 shadow-md">
                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider select-none">You Said</span>
                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  "{transcript}"
                </p>
              </div>
            )}

            {/* AI Response Card */}
            {aiReply && (
              <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[9px] bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2.5 py-0.5 rounded-full font-bold select-none uppercase tracking-wider">
                    Stadium Voice Reply
                  </span>

                  {/* Equalizer and Speaker action button */}
                  <div className="flex items-center gap-3">
                    {/* Bouncing audio wave equalizer */}
                    <div className="flex gap-0.5 items-end h-7 shrink-0">
                      <span className={`w-0.5 bg-purple-400 rounded-full ${isSpeaking ? 'animate-voice-bar-1' : 'h-1.5'}`}></span>
                      <span className={`w-0.5 bg-purple-400 rounded-full ${isSpeaking ? 'animate-voice-bar-2' : 'h-1.5'}`}></span>
                      <span className={`w-0.5 bg-purple-400 rounded-full ${isSpeaking ? 'animate-voice-bar-3' : 'h-1.5'}`}></span>
                      <span className={`w-0.5 bg-purple-400 rounded-full ${isSpeaking ? 'animate-voice-bar-4' : 'h-1.5'}`}></span>
                      <span className={`w-0.5 bg-purple-400 rounded-full ${isSpeaking ? 'animate-voice-bar-5' : 'h-1.5'}`}></span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSpeakerClick}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-purple-600 text-white border border-purple-500'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-semibold">
                  {aiReply}
                </p>
              </div>
            )}

          </div>
        )}

      </div>

      <AILoader isLoading={isLoading} />
    </div>
  );
}
