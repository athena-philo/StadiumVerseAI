import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation as NavIcon, 
  Compass, 
  Info, 
  Utensils, 
  Activity, 
  ShoppingBag, 
  LogOut, 
  Armchair, 
  Users,
  X 
} from 'lucide-react';

const NODES = {
  'Gate A': { 
    x: 250, 
    y: 50, 
    color: '#3b82f6', 
    category: 'gate', 
    label: 'Gate A (North Entrance)', 
    desc: 'Main North Gate featuring step-free scanner checkpoints and wheelchair access lines.' 
  },
  'Gate B': { 
    x: 250, 
    y: 250, 
    color: '#3b82f6', 
    category: 'gate', 
    label: 'Gate B (South Entrance)', 
    desc: 'Main South Gate near the train station concourse. Elevated walkways connect directly.' 
  },
  'Seat B12': { 
    x: 150, 
    y: 90, 
    color: '#a855f7', 
    category: 'seat', 
    label: 'Seat B12 (Sec B)', 
    desc: 'Level 2 section B seating. Step-free elevators are located directly behind row 4.' 
  },
  'Section 102': { 
    x: 350, 
    y: 160, 
    color: '#a855f7', 
    category: 'seat', 
    label: 'Section 102', 
    desc: 'Main lower bowl seating ring. Clear line of sight to the pitch action.' 
  },
  'Restrooms Concourse A': { 
    x: 160, 
    y: 200, 
    color: '#10b981', 
    category: 'restroom', 
    label: 'Restrooms Concourse A', 
    desc: 'Equipped with step-free accessible units, baby changing cubicles, and dynamic wait timers.' 
  },
  'Restrooms Concourse B': { 
    x: 340, 
    y: 90, 
    color: '#10b981', 
    category: 'restroom', 
    label: 'Restrooms Concourse B', 
    desc: 'Conveniently located behind Level 1 concessions. 1-minute current wait time.' 
  },
  'East Concourse Grill': { 
    x: 340, 
    y: 200, 
    color: '#f59e0b', 
    category: 'food', 
    label: 'East Concourse Grill', 
    desc: 'Serves prime burgers, vegan hotdogs, and gluten-free snack combos. Fully accessible service counter.' 
  },
  'Stadium Bites': { 
    x: 160, 
    y: 65, 
    color: '#f59e0b', 
    category: 'food', 
    label: 'Stadium Bites (Food)', 
    desc: 'Express beverage cart with draft sodas, warm pretzels, and popcorn boxes.' 
  },
  'First Aid Room': { 
    x: 250, 
    y: 90, 
    color: '#ef4444', 
    category: 'medical', 
    label: 'First Aid Room', 
    desc: '24/7 Red Cross medical center with trauma beds, oxygen supply, and guest transport escorts.' 
  },
  'Parking Lot': { 
    x: 250, 
    y: 310, 
    color: '#6b7280', 
    category: 'navigation', 
    label: 'Parking Lot', 
    desc: 'West ring car park with dedicated blue disabled badge bays and taxi transit points.' 
  },
  'Emergency Exit North': { 
    x: 100, 
    y: 50, 
    color: '#ef4444', 
    category: 'exit', 
    label: 'Emergency Exit North', 
    desc: 'High-clearance emergency exit stairs leading directly to external evacuation Muster Zone A.' 
  },
  'Emergency Exit South': { 
    x: 400, 
    y: 250, 
    color: '#ef4444', 
    category: 'exit', 
    label: 'Emergency Exit South', 
    desc: 'Wide emergency slide egress ramp leading directly to Muster Zone B.' 
  },
  'East Fan Shop': { 
    x: 390, 
    y: 130, 
    color: '#ec4899', 
    category: 'merchandise', 
    label: 'East Fan Shop', 
    desc: 'Main merchandise store offering official team jerseys, scarves, and collectable souvenir tokens.' 
  }
};

function getMarkerIcon(category) {
  switch (category) {
    case 'gate': return NavIcon;
    case 'food': return Utensils;
    case 'restroom': return Users;
    case 'medical': return Activity;
    case 'merchandise': return ShoppingBag;
    case 'exit': return LogOut;
    case 'seat': return Armchair;
    default: return MapPin;
  }
}

function getGlowColor(category) {
  switch (category) {
    case 'gate': return 'bg-blue-500/20';
    case 'food': return 'bg-emerald-500/20';
    case 'restroom': return 'bg-teal-500/20';
    case 'medical': return 'bg-red-500/20';
    case 'merchandise': return 'bg-pink-500/20';
    case 'exit': return 'bg-red-500/20';
    default: return 'bg-purple-500/20';
  }
}

function getBorderColor(category) {
  switch (category) {
    case 'gate': return 'border-blue-500/50';
    case 'food': return 'border-emerald-500/50';
    case 'restroom': return 'border-teal-500/50';
    case 'medical': return 'border-red-500/50';
    case 'merchandise': return 'border-pink-500/50';
    case 'exit': return 'border-red-500/50';
    default: return 'border-purple-500/50';
  }
}

function getMarkerStyles(category, isSelected) {
  if (isSelected) {
    return 'bg-white text-[#0c0a18] border-white scale-105';
  }
  switch (category) {
    case 'gate': return 'bg-blue-950/90 text-blue-400 border-blue-500/30 hover:border-blue-400';
    case 'food': return 'bg-emerald-950/90 text-emerald-400 border-emerald-500/30 hover:border-emerald-400';
    case 'restroom': return 'bg-[#0f2425]/95 text-teal-400 border-teal-500/30 hover:border-teal-400';
    case 'medical': return 'bg-red-950/90 text-red-400 border-red-500/30 hover:border-red-400';
    case 'merchandise': return 'bg-pink-950/90 text-pink-400 border-pink-500/30 hover:border-pink-400';
    case 'exit': return 'bg-red-950/90 text-red-400 border-red-500/30 hover:border-red-400';
    default: return 'bg-purple-950/90 text-purple-400 border-purple-500/30 hover:border-purple-400';
  }
}

const StadiumMap = React.memo(function StadiumMap({ source, destination, setSource, setDestination }) {
  const [routePath, setRoutePath] = useState('');
  const [distance, setDistance] = useState(0);
  const [eta, setEta] = useState('');
  const [directions, setDirections] = useState([]);
  const [activePopupNode, setActivePopupNode] = useState(null);

  // Calculate route path and directions on source/destination change
  useEffect(() => {
    if (!source || !destination || source === destination) {
      setRoutePath('');
      setDistance(0);
      setEta('');
      setDirections([]);
      return;
    }

    const p1 = NODES[source];
    const p2 = NODES[destination];

    if (!p1 || !p2) return;

    let pathPoints = [];
    let d = 0;
    let etaString = '';
    let stepList = [];

    // Handcrafted paths for smooth concourse routing representation
    if (source === 'Gate A' && destination === 'Seat B12') {
      pathPoints = [
        { x: 250, y: 50 },
        { x: 210, y: 70 },
        { x: 150, y: 90 }
      ];
      d = 120;
      etaString = '1 min 30 secs';
      stepList = [
        "Enter through Gate A (North Entrance).",
        "Take the escalators on the right up to Concourse A.",
        "Turn right and walk past Stadium Bites. Section B12 is on your left."
      ];
    } else if (source === 'Section 102' && destination === 'Restrooms Concourse A') {
      pathPoints = [
        { x: 350, y: 160 },
        { x: 300, y: 210 },
        { x: 250, y: 230 },
        { x: 200, y: 220 },
        { x: 160, y: 200 }
      ];
      d = 210;
      etaString = '2 mins 40 secs';
      stepList = [
        "Leave Section 102 and enter Concourse Level 2.",
        "Head south (right) along the concourse ring corridor.",
        "Pass the East Concourse Grill and continue past Gate B.",
        "Restrooms Concourse A are located on the left corridor."
      ];
    } else if (source === 'Parking Lot' && destination === 'Gate A') {
      pathPoints = [
        { x: 250, y: 310 },
        { x: 250, y: 250 },
        { x: 360, y: 150 },
        { x: 250, y: 50 }
      ];
      d = 340;
      etaString = '4 mins 15 secs';
      stepList = [
        "From Parking Lot, walk north toward Gate B entrance.",
        "Bypass Gate B and follow the outer east concourse loop trail.",
        "Continue past Section 102 straight to Gate A north check-in gates."
      ];
    } else {
      // General fall-through path routing (source -> center -> destination)
      pathPoints = [
        { x: p1.x, y: p1.y },
        { x: 250, y: 150 },
        { x: p2.x, y: p2.y }
      ];
      // Calculate geometric distance
      const dx1 = 250 - p1.x;
      const dy1 = 150 - p1.y;
      const dx2 = p2.x - 250;
      const dy2 = p2.y - 150;
      const totalPixels = Math.sqrt(dx1*dx1 + dy1*dy1) + Math.sqrt(dx2*dx2 + dy2*dy2);
      d = Math.round(totalPixels * 0.8);
      const totalSecs = Math.round(d / 1.3); // walking speed 1.3 m/s
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      etaString = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''} ${secs} secs` : `${secs} secs`;
      stepList = [
        `Depart from ${source}.`,
        "Enter main concourse circular corridor.",
        `Proceed directly along visual markers to your destination: ${destination}.`
      ];
    }

    // Convert points to SVG path format "M x y L x y L x y"
    const pathString = pathPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
    setRoutePath(pathString);
    setDistance(d);
    setEta(etaString);
    setDirections(stepList);
  }, [source, destination]);

  return (
    <section id="navigation" className="py-20 border-t border-white/5 scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-3">Live Navigation</h2>
        <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Smart Stadium Seat & Gate Map
        </p>
        <p className="text-sm text-gray-400 mt-3 max-w-xl mx-auto">
          Click markers directly on the interactive map below to view concourse details, set routes, and highlight AI paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* SVG Interactive Map Panel */}
        <div className="lg:col-span-7 glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center shadow-2xl min-h-[400px]">
          <div className="w-full flex justify-between items-center mb-4 text-xs text-gray-400">
            <span>🏟️ Interactive Stadium Map Grid</span>
            <span className="text-blue-400 flex items-center gap-1 font-bold">
              <Compass className="h-3.5 w-3.5 animate-spin-slow" /> Concourse Level 2
            </span>
          </div>

          <div className="relative w-full max-w-[500px] aspect-[5/4] bg-black/40 border border-white/5 rounded-2xl p-2 overflow-hidden">
            
            {/* SVG Layer for lines */}
            <svg 
              viewBox="0 0 500 400" 
              className="w-full h-full select-none absolute inset-0 z-10"
            >
              <defs>
                {/* Glow Filter for route paths */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer Stadium Ellipse wall */}
              <ellipse 
                cx="250" 
                cy="150" 
                rx="180" 
                ry="120" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="16" 
              />
              {/* Inner Seating Ring boundary */}
              <ellipse 
                cx="250" 
                cy="150" 
                rx="140" 
                ry="90" 
                fill="none" 
                stroke="rgba(168, 85, 247, 0.15)" 
                strokeWidth="4" 
              />
              {/* Inner Pitch (Action Arena) */}
              <ellipse 
                cx="250" 
                cy="150" 
                rx="90" 
                ry="50" 
                fill="rgba(16, 185, 129, 0.05)" 
                stroke="rgba(16, 185, 129, 0.2)" 
                strokeWidth="2" 
              />
              {/* Main Concourse Circular Corridor Corridor path */}
              <ellipse 
                cx="250" 
                cy="150" 
                rx="160" 
                ry="105" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.03)" 
                strokeWidth="12" 
                strokeDasharray="6,6"
              />

              {/* Render Selected Route Path */}
              {routePath && (
                <>
                  {/* Glowing background line */}
                  <path 
                    d={routePath} 
                    fill="none" 
                    stroke="rgba(59, 130, 246, 0.4)" 
                    strokeWidth="7" 
                    filter="url(#glow)"
                  />
                  {/* Animated dotted overlay line */}
                  <path 
                    d={routePath} 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="4" 
                    strokeDasharray="8,6"
                    className="animate-[dash_2s_linear_infinite]"
                    style={{
                      strokeDashoffset: 100,
                      animationKeyframes: 'dash'
                    }}
                  />
                </>
              )}
            </svg>

            {/* Absolute interactive markers on top of SVG */}
            {Object.entries(NODES).map(([name, node]) => {
              const isSelected = name === source || name === destination;
              const Icon = getMarkerIcon(node.category);
              
              return (
                <button
                  key={name}
                  onClick={() => setActivePopupNode(name)}
                  style={{
                    left: `${(node.x / 500) * 100}%`,
                    top: `${(node.y / 400) * 100}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer active:scale-95"
                >
                  {/* Glowing backdrop */}
                  <span className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${getGlowColor(node.category)}`}></span>
                  
                  {/* Pulsing ring if selected */}
                  {isSelected && (
                    <span className={`absolute -inset-2 rounded-xl animate-ping border opacity-75 ${getBorderColor(node.category)}`}></span>
                  )}
                  
                  {/* Main Marker Icon Box */}
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center border shadow-md relative transition-all duration-300 group-hover:scale-110 ${getMarkerStyles(node.category, isSelected)}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Small tooltip label */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-9 bg-black/85 border border-white/10 text-[9px] px-2 py-0.5 rounded-full font-bold text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none z-30 shadow-lg shadow-black/40">
                    {name}
                  </span>
                </button>
              );
            })}

            {/* Interactive detailed popup overlay */}
            {activePopupNode && (() => {
              const node = NODES[activePopupNode];
              return (
                <div 
                  style={{
                    left: `${(node.x / 500) * 100}%`,
                    top: `${(node.y / 400) * 100}%`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-[108%] z-30 bg-[#0e0c1beb] border border-white/10 p-4.5 rounded-2xl shadow-2xl w-[260px] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full font-bold text-purple-400 uppercase tracking-wide">
                        {node.category}
                      </span>
                      <h4 className="text-xs font-black text-white mt-1.5">{node.label}</h4>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setActivePopupNode(null)}
                      className="text-gray-500 hover:text-white p-0.5 rounded-md hover:bg-white/5 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                    {node.desc}
                  </p>

                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSource(activePopupNode);
                        setActivePopupNode(null);
                      }}
                      className="flex-grow py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center select-none active:scale-95"
                    >
                      Set as Start
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination(activePopupNode);
                        setActivePopupNode(null);
                      }}
                      className="flex-grow py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center select-none active:scale-95"
                    >
                      Set as End
                    </button>
                  </div>

                  {/* Small caret pointer */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0e0c1beb]"></div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Path Calculation Console Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex flex-col gap-5">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <NavIcon className="h-5 w-5 text-blue-400" />
              Route Planner Console
            </h3>

            {/* Input Selection Dropdowns */}
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Source Point</label>
                <select 
                  value={source} 
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0f0c1b]">-- Select Source --</option>
                  {Object.keys(NODES).map(name => (
                    <option key={name} value={name} className="bg-[#0f0c1b]">{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Destination Point</label>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0f0c1b]">-- Select Destination --</option>
                  {Object.keys(NODES).map(name => (
                    <option key={name} value={name} className="bg-[#0f0c1b]">{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Path calculation stats */}
            {routePath ? (
              <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] text-gray-400 font-medium">Walking Distance</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{distance} meters</h4>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium">Estimated Walk Time</span>
                  <h4 className="text-lg font-bold text-purple-400 mt-0.5">{eta}</h4>
                </div>
              </div>
            ) : (
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <Info className="h-4 w-4 text-gray-600" />
                Select a source and destination to plot the route.
              </div>
            )}
          </div>

          {/* Navigation Route directions */}
          {directions.length > 0 && (
            <div className="glassmorphism border border-white/10 rounded-3xl p-6 flex-grow flex flex-col gap-4 animate-in fade-in duration-300">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Route Directions</h4>
              <ol className="flex flex-col gap-3.5 text-xs text-gray-300">
                {directions.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

      </div>
    </section>
  );
});

export default StadiumMap;
