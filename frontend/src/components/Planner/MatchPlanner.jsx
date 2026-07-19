import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Heart, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AILoader from '../AILoader';
import AIErrorCard from '../AIErrorCard';

export default function MatchPlanner() {
  const [arrivalTime, setArrivalTime] = useState('18:00');
  const [gate, setGate] = useState('Gate A');
  const [seatNumber, setSeatNumber] = useState('Section 102, Seat B12');
  const [numPeople, setNumPeople] = useState(2);
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [accessibility, setAccessibility] = useState('None');
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsGenerating(true);
    setError('');
    setItinerary('');

    try {
      const response = await fetch('https://stadiumverseai.onrender.com/api/planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          arrivalTime,
          gate,
          seatNumber,
          numPeople,
          dietaryPreference,
          accessibility
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate your personalized match plan. Please try again.');
      }

      const data = await response.json();
      setItinerary(data.plan);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-10 flex flex-col gap-6 page-transition">
      
      {/* Return Home Nav Button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10 select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Config Panel */}
        <form 
          onSubmit={handleSubmit}
          className="lg:col-span-5 glassmorphism border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
        >
          {/* Header Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <span className="text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full font-bold select-none uppercase tracking-wider">
              Smart Assistant
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-3 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-400" />
              Match Planner
            </h1>
            <p className="text-xs text-gray-400 mt-1.5">
              Enter your arrival parameters to compile an optimized, context-aware itinerary.
            </p>
          </div>

          <div className="h-[1px] bg-white/5 my-1"></div>

          <div className="flex flex-col gap-4">
            
            {/* Arrival Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-400" /> Planned Arrival Time
              </label>
              <input 
                type="time" 
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                required
                disabled={isGenerating}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Entrance Gate */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-400" /> Planned Entry Gate
              </label>
              <select
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                disabled={isGenerating}
                className="bg-[#0f0c1b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Gate A">Gate A (North Entrance)</option>
                <option value="Gate B">Gate B (South Entrance)</option>
                <option value="Gate C">Gate C (East Entrance)</option>
              </select>
            </div>

            {/* Seat Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-400" /> Seat Number / Section
              </label>
              <input 
                type="text" 
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                placeholder="e.g. Section 102, Seat B12"
                required
                disabled={isGenerating}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Number of People */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-400" /> Number of People
              </label>
              <input 
                type="number" 
                min="1"
                max="20"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                required
                disabled={isGenerating}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Dietary Preference */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-purple-400" /> Dietary Preference
              </label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                disabled={isGenerating}
                className="bg-[#0f0c1b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="None">No Dietary Preferences</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Halal">Halal</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>

            {/* Accessibility Requirement */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-purple-400" /> Accessibility Need (Optional)
              </label>
              <select
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                disabled={isGenerating}
                className="bg-[#0f0c1b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/60 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="None">None</option>
                <option value="Wheelchair Accessible">Wheelchair Access ♿</option>
                <option value="Step-Free Access">Step-free / Lift Access</option>
                <option value="Assistance Companion">Assistance Escort</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 select-none flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Generating Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-purple-200" />
                Generate My Match Plan
              </>
            )}
          </button>

        </form>

        {/* Right Panel: Display Itinerary Result */}
        <div className="lg:col-span-7 h-full flex flex-col">
          
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 sm:p-8 flex-grow shadow-2xl relative min-h-[450px] flex flex-col justify-between overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Your Personalized Itinerary
                </h2>
                {itinerary && (
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold select-none uppercase tracking-wider">
                    Ready
                  </span>
                )}
              </div>

              {/* Error Box */}
              {error && (
                <AIErrorCard 
                  onRetry={() => handleSubmit()}
                  onCancel={() => setError('')}
                  errorText={error}
                />
              )}

              {/* Loading Indicator inside output box */}
              {isGenerating && (
                <div className="flex-grow flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  <p className="text-xs text-purple-400 animate-pulse font-medium">StadiumVerse AI is compiling wait times and coordinates...</p>
                </div>
              )}

              {/* Display Result Itinerary */}
              {!isGenerating && itinerary && (
                <div className="flex-grow overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {itinerary}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isGenerating && !itinerary && !error && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-6 gap-3">
                  <Calendar className="h-12 w-12 text-gray-600 animate-bounce" />
                  <div>
                    <h4 className="text-sm font-bold text-white">No Itinerary Generated Yet</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto">
                      Fill out the matching options on the left and tap generate to fetch your optimized live match plan!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom info section */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <span>*Itinerary dynamically matches current simulated queues.</span>
              <span>StadiumVerseAI v1.2</span>
            </div>

          </div>

        </div>

      </div>

      <AILoader isLoading={isGenerating} />
    </div>
  );
}
