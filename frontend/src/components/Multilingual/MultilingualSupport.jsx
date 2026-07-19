import React, { useState } from 'react';
import { Globe, ArrowLeft, Sparkles, Languages, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AILoader from '../AILoader';
import AIErrorCard from '../AIErrorCard';

export default function MultilingualSupport() {
  const [sourceText, setSourceText] = useState('Please proceed to Gate A.');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError('');
    setTranslatedText('');

    try {
      const response = await fetch('https://stadiumverseai.onrender.com/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed. Please try again.');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setIsTranslating(false);
    }
  };

  const examplePhrases = [
    "📢 Please proceed to Gate A.",
    "🚨 Emergency exit this way.",
    "⏱️ Kickoff starts in 10 minutes."
  ];

  const handlePhraseClick = (phrase) => {
    if (isTranslating) return;
    // Strip emojis for clean text translation
    const cleanPhrase = phrase.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
    setSourceText(cleanPhrase);
  };

  const languagesList = [
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Arabic",
    "Japanese",
    "English"
  ];

  return (
    <div className="py-10 flex flex-col gap-6 page-transition">
      
      {/* Back to Home Button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10 select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Translation Inputs */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <form 
            onSubmit={handleTranslate}
            className="glassmorphism border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            {/* Header Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <span className="text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full font-bold select-none uppercase tracking-wider">
                Stadium Translator
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3 flex items-center gap-2">
                <Languages className="h-6 w-6 text-purple-400" />
                Multilingual Support
              </h1>
              <p className="text-xs text-gray-400 mt-1.5">
                Translate PA announcements, directions, safety guidelines, and seat routes instantly.
              </p>
            </div>

            <div className="h-[1px] bg-white/5 my-1"></div>

            {/* Quick example announcements */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Quick Examples</span>
              <div className="flex flex-wrap gap-2">
                {examplePhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePhraseClick(phrase)}
                    disabled={isTranslating}
                    className="text-[11px] bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/30 rounded-xl px-3.5 py-2 font-medium text-gray-300 hover:text-white transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400">Announcement / Custom Text</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type or paste stadium message here..."
                required
                disabled={isTranslating}
                rows={4}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white placeholder:text-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Language Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-purple-400" /> Translate to Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={isTranslating}
                className="bg-[#0f0c1b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {languagesList.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isTranslating || !sourceText.trim()}
              className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 select-none flex items-center justify-center gap-2"
            >
              {isTranslating ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-purple-200" />
                  Translate Announcement
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Side: Translation Output Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 sm:p-8 flex-grow shadow-2xl relative min-h-[380px] flex flex-col justify-between overflow-hidden">
            {/* Glowing Effects */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col h-full">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-400" />
                  Translation Output
                </h2>
                {translatedText && (
                  <span className="text-[10px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2.5 py-0.5 rounded-full font-bold select-none uppercase tracking-wider">
                    {targetLanguage}
                  </span>
                )}
              </div>

              {/* Error Box */}
              {error && (
                <AIErrorCard 
                  onRetry={() => handleTranslate()}
                  onCancel={() => setError('')}
                  errorText={error}
                />
              )}

              {/* Loading Indicator */}
              {isTranslating && (
                <div className="flex-grow flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  <p className="text-xs text-purple-400 animate-pulse font-medium">Translating announcement details...</p>
                </div>
              )}

              {/* Translation Panels Grid */}
              {!isTranslating && !error && (
                <div className="flex flex-col gap-5 flex-grow justify-center">
                  
                  {/* Original Panel */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Original Text</span>
                    <p className="text-xs text-gray-400 italic">"{sourceText || 'No text entered'}"</p>
                  </div>

                  {/* Output Panel */}
                  {translatedText ? (
                    <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-4 flex flex-col gap-1.5 animate-in fade-in duration-300">
                      <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Translated Output ({targetLanguage})</span>
                      <p className="text-sm font-extrabold text-white">"{translatedText}"</p>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 gap-2">
                      <HelpCircle className="h-10 w-10 text-gray-600" />
                      <h4 className="text-xs font-bold text-gray-500">Awaiting Translation Output</h4>
                      <p className="text-[10px] text-gray-600 max-w-[200px] mx-auto">
                        Enter source text on the left and select your language to view translated announcers.
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Version Panel */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <span>*Powered by Google Gemini generative translation.</span>
              <span>StadiumVerseAI Translate v1.0</span>
            </div>

          </div>

        </div>

      </div>

      <AILoader isLoading={isTranslating} />
    </div>
  );
}
