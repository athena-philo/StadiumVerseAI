import React, { useState, useEffect } from 'react';
import { Users, Clock, RefreshCw, AlertCircle, BarChart3, Activity } from 'lucide-react';

export default function CrowdIntelligence() {
  const [crowdData, setCrowdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(25);

  const fetchCrowdData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crowd');
      if (!res.ok) {
        throw new Error('Failed to retrieve crowd status');
      }
      const data = await res.json();
      setCrowdData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not fetch real-time crowd metrics.');
    } finally {
      setLoading(false);
      setSecondsLeft(25); // reset countdown timer
    }
  };

  // Poll crowd statistics
  useEffect(() => {
    fetchCrowdData();
    
    // Countdown timer interval
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          fetchCrowdData();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'low') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getIndicatorDot = (status) => {
    if (status === 'low') return '🟢';
    if (status === 'medium') return '🟡';
    return '🔴';
  };

  // Compute Concourse Densities dynamically for map fills
  const getZoneDensityColor = (zone) => {
    if (!crowdData) return 'rgba(255, 255, 255, 0.05)';
    
    let wait = 0;
    if (zone === 'north') {
      wait = crowdData.gates.find(g => g.id === 'gate-a')?.waitTime || 0;
    } else if (zone === 'south') {
      wait = crowdData.gates.find(g => g.id === 'gate-b')?.waitTime || 0;
    } else if (zone === 'west') {
      const rest = crowdData.restrooms.find(r => r.id === 'restroom-a')?.waitTime || 0;
      const bites = crowdData.foodStalls.find(f => f.id === 'stadium-bites')?.waitTime || 0;
      wait = (rest + bites) / 2;
    } else if (zone === 'east') {
      const rest = crowdData.restrooms.find(r => r.id === 'restroom-b')?.waitTime || 0;
      const grill = crowdData.foodStalls.find(f => f.id === 'east-grill')?.waitTime || 0;
      wait = (rest + grill) / 2;
    }

    if (wait < 4) return 'rgba(16, 185, 129, 0.2)'; // Green
    if (wait < 10) return 'rgba(245, 158, 11, 0.2)'; // Yellow
    return 'rgba(239, 68, 68, 0.2)'; // Red
  };

  return (
    <section id="crowd" className="py-20 border-t border-white/5 scroll-mt-20 page-transition">
      
      {/* Header and sync button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h2 className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">IoT Arena Sensors</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Live Crowd Intelligence
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Estimated queue lines and section occupancy rates. Sensors refresh automatically.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Auto-Syncing</span>
            <span className="text-xs font-medium text-gray-300">{secondsLeft}s remaining</span>
          </div>
          <div className="h-6 w-[2px] bg-white/15"></div>
          <button 
            onClick={fetchCrowdData}
            disabled={loading}
            className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="h-5 w-5" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Crowd Density Map overlay */}
        <div className="lg:col-span-5 glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl min-h-[400px]">
          <div>
            <span className="text-xs text-gray-400 font-medium">🗺️ Crowd Density Heatmap</span>
            <p className="text-2xl font-bold text-white mt-1">Simulated Zone Load</p>
          </div>

          {/* Stadium Vector Diagram */}
          <div className="w-full flex justify-center items-center py-6">
            <svg viewBox="0 0 300 240" className="w-full max-w-[280px]">
              {/* North Zone polygon */}
              <path 
                d="M 60,40 Q 150,5 240,40 L 210,75 Q 150,55 90,75 Z" 
                fill={getZoneDensityColor('north')} 
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <text x="150" y="32" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">Gate A (North)</text>

              {/* South Zone polygon */}
              <path 
                d="M 60,200 Q 150,235 240,200 L 210,165 Q 150,185 90,165 Z" 
                fill={getZoneDensityColor('south')} 
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <text x="150" y="212" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">Gate B (South)</text>

              {/* West Concourse (Left) */}
              <path 
                d="M 60,40 Q 10,120 60,200 L 90,165 Q 60,120 90,75 Z" 
                fill={getZoneDensityColor('west')} 
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <text x="50" y="123" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" transform="rotate(-90 50 123)">Concourse A</text>

              {/* East Concourse (Right) */}
              <path 
                d="M 240,40 Q 290,120 240,200 L 210,165 Q 240,120 210,75 Z" 
                fill={getZoneDensityColor('east')} 
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <text x="250" y="123" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" transform="rotate(90 250 123)">Concourse B</text>

              {/* Pitch central outline */}
              <ellipse cx="150" cy="120" rx="40" ry="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold border-t border-white/5 pt-4">
            <span className="flex items-center gap-1">🟢 Low (&lt; 4 mins)</span>
            <span className="flex items-center gap-1">🟡 Medium (4 - 10 mins)</span>
            <span className="flex items-center gap-1">🔴 High (&gt; 10 mins)</span>
          </div>
        </div>

        {/* Live Metrics Queue Panels */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {crowdData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Panel 1: Entrance Gates */}
              <div className="glassmorphism border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-blue-400" />
                  Entrance Gates wait
                </h3>
                <div className="flex flex-col gap-3.5">
                  {crowdData.gates.map(gate => (
                    <div key={gate.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">{gate.name}</h4>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{gate.count} / {gate.capacity} Spectators</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getStatusColor(gate.status)}`}>
                          {getIndicatorDot(gate.status)} {gate.waitTime}m wait
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 2: Food Vendors */}
              <div className="glassmorphism border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-yellow-400" />
                  Food Concessions Wait
                </h3>
                <div className="flex flex-col gap-3.5">
                  {crowdData.foodStalls.map(food => (
                    <div key={food.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">{food.name}</h4>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Capacity ratio: {Math.round(food.count / food.capacity * 100)}%</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getStatusColor(food.status)}`}>
                          {getIndicatorDot(food.status)} {food.waitTime}m wait
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 3: Restrooms Concourse */}
              <div className="glassmorphism border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-emerald-400" />
                  Restrooms Congestion
                </h3>
                <div className="flex flex-col gap-3.5">
                  {crowdData.restrooms.map(restroom => (
                    <div key={restroom.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">{restroom.name}</h4>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Load: {restroom.count} users</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getStatusColor(restroom.status)}`}>
                          {getIndicatorDot(restroom.status)} {restroom.waitTime}m wait
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel 4: Seating Sections */}
              <div className="glassmorphism border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-purple-400" />
                  Seat Ring Fill Rates
                </h3>
                <div className="flex flex-col gap-3.5">
                  {crowdData.seating.map(seat => (
                    <div key={seat.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-300">{seat.name}</h4>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Occupied: {seat.count} seats</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${getStatusColor(seat.status)}`}>
                          {getIndicatorDot(seat.status)} {Math.round(seat.count / seat.capacity * 100)}% full
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
}
