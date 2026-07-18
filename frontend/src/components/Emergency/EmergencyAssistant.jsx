import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Flame, Users, Activity, HelpCircle, ArrowLeft, Sparkles, HeartPulse, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';
import AILoader from '../AILoader';
import AIErrorCard from '../AIErrorCard';

function SeverityBadge({ severity }) {
  const level = (severity || 'low').toLowerCase();
  
  if (level === 'critical') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-extrabold bg-red-500/15 border border-red-500/30 text-red-400 select-none animate-pulse">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        🚨 CRITICAL LEVEL ALERT
      </div>
    );
  }
  if (level === 'high') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-extrabold bg-orange-500/15 border border-orange-500/30 text-orange-400 select-none">
        <AlertTriangle className="h-4 w-4 text-orange-400" />
        🟠 HIGH LEVEL REPORT
      </div>
    );
  }
  if (level === 'medium') {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-extrabold bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 select-none">
        <AlertTriangle className="h-4 w-4 text-yellow-400" />
        🟡 MEDIUM LEVEL WARNING
      </div>
    );
  }
  
  // Default to low
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 select-none">
      <Activity className="h-4 w-4 text-emerald-400" />
      🟢 LOW LEVEL UPDATE
    </div>
  );
}

export default function EmergencyAssistant() {
  const [description, setDescription] = useState('Someone has fainted near Section 102.');
  const [category, setCategory] = useState('medical');
  const [responsePlan, setResponsePlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setError('');
    setResponsePlan(null);

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          category
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach emergency assistance server. Please attempt to notify local stewards directly.');
      }

      const data = await response.json();
      setResponsePlan(data); // Stores { severity, plan }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emergencyScenarios = [
    { label: "Medical Emergency", text: "Someone has fainted near Section 102.", cat: "medical", icon: HeartPulse },
    { label: "Lost Child", text: "I lost my child near the main Gate A concessions.", cat: "lost_child", icon: Users },
    { label: "Fire Hazard", text: "There is smoke near Gate B entrance restrooms.", cat: "fire", icon: Flame },
    { label: "Security Issue", text: "Someone is behaving aggressively and shouting at fans.", cat: "security", icon: ShieldAlert },
    { label: "Accessibility Guide", text: "I need wheelchair assistance to reach the elevators.", cat: "accessibility", icon: Accessibility }
  ];

  const handleScenarioClick = (scenario) => {
    if (isSubmitting) return;
    setDescription(scenario.text);
    setCategory(scenario.cat);
  };

  return (
    <div className="py-10 flex flex-col gap-6 page-transition">
      
      {/* Return Home Button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-white bg-red-950/25 hover:bg-red-950/45 border border-red-500/20 hover:border-red-500/35 px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-black/10 select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Home
        </Link>
      </div>

      {/* Emergency Warning Banner */}
      <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 flex gap-3.5 items-center">
        <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
          <AlertTriangle className="h-5.5 w-5.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-400 uppercase tracking-wide">Emergency Alert Center</h4>
          <p className="text-xs text-gray-400 mt-0.5">
            If you or someone nearby is in immediate life-threatening danger, please locate the nearest steward or call local emergency dispatch (e.g. 911) immediately.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Form Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <form 
            onSubmit={handleSubmit}
            className="bg-[#0f070b]/90 border border-red-500/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
          >
            {/* Header Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <span className="text-[10px] bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full font-bold select-none uppercase tracking-wider">
                Safety Dispatch
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3 flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-red-400" />
                Emergency Assistant
              </h1>
              <p className="text-xs text-gray-400 mt-1.5">
                Report incidents to compile crowds, safe exits, medical points, and contact guidelines.
              </p>
            </div>

            <div className="h-[1px] bg-white/5 my-1"></div>

            {/* Quick Action Category select buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Quick Report Templates</span>
              <div className="flex flex-col gap-2">
                {emergencyScenarios.map((sc, idx) => {
                  const Icon = sc.icon;
                  const isSelected = category === sc.cat;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleScenarioClick(sc)}
                      disabled={isSubmitting}
                      className={`px-4 py-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected 
                          ? 'text-red-400 bg-red-500/10 border-red-500/30' 
                          : 'text-gray-400 bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-red-400' : 'text-gray-500'}`} />
                        {sc.label}
                      </span>
                      <span className="text-[10px] text-gray-600">{isSelected ? 'Active' : 'Apply'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400">Describe the Emergency</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is happening? Include Section, Seat, or Gate location details..."
                required
                disabled={isSubmitting}
                rows={4}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 text-white placeholder:text-gray-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="w-full mt-2 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-red-500/10 disabled:opacity-50 disabled:scale-100 select-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing Situation...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-200" />
                  Generate Emergency Plan
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Side: Response Panel Output */}
        <div className="lg:col-span-7 h-full flex flex-col">
          
          <div className="bg-[#0b080c]/90 border border-red-500/10 rounded-3xl p-6 sm:p-8 flex-grow shadow-2xl relative min-h-[420px] flex flex-col justify-between overflow-hidden">
            {/* Ambient Red glow */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col h-full">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                  AI Emergency Response Plan
                </h2>
                {responsePlan && (
                  <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full font-bold select-none uppercase tracking-wider">
                    High Priority
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

              {/* Submitting Loading Status */}
              {isSubmitting && (
                <div className="flex-grow flex flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                  <p className="text-xs text-red-400 animate-pulse font-medium">StadiumVerse Safety Server is evaluating route queues...</p>
                </div>
              )}

              {/* Display Generated Safe Exit Guideline */}
              {!isSubmitting && responsePlan && (
                <div className="flex-grow overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 flex flex-col gap-4 animate-in fade-in duration-300">
                  <div>
                    <SeverityBadge severity={responsePlan.severity} />
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                    {responsePlan.plan}
                  </div>
                </div>
              )}

              {/* Default Empty State */}
              {!isSubmitting && !responsePlan && !error && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-6 gap-3">
                  <AlertTriangle className="h-12 w-12 text-red-700 animate-bounce" />
                  <div>
                    <h4 className="text-sm font-bold text-white">No Incident Selected</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-[280px] mx-auto">
                      Fill out or choose a quick report template on the left and tap generate to compile an optimized AI safety plan immediately.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Foyer notes */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <span>*Itinerary dynamically checks current crowd density indexes.</span>
              <span>StadiumVerse Safety Dispatch v1.0</span>
            </div>

          </div>

        </div>

      </div>

      <AILoader isLoading={isSubmitting} />
    </div>
  );
}
