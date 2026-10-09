import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  Utensils,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OverviewHeroRadarSweep: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { listings, predictions, setCurrentView, setSelectedListing } = useApp();
  const [activeBlipId, setActiveBlipId] = useState<string>('pred-101');
  const [sweepSpeed, setSweepSpeed] = useState<'normal' | 'fast'>('normal');

  // Real targets with names and surplus details scattered nicely around the radar
  const targets = [
    {
      id: 'pred-101',
      name: 'Bake & Craft Gourmet',
      type: 'Bakery',
      meals: 45,
      items: 'Artisan Loaves & Quiches',
      distanceKm: 1.8,
      eta: '8 mins',
      angleDeg: 42,
      distanceRatio: 0.65, // well scattered away from center
      urgency: 'Critical',
      prob: 94,
      isPrediction: true,
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'lst-101',
      name: 'Urban Tiffin House',
      type: 'Restaurant',
      meals: 85,
      items: 'Shahi Paneer & Basmati',
      distanceKm: 2.8,
      eta: '12 mins',
      angleDeg: 140,
      distanceRatio: 0.78,
      urgency: 'Critical',
      prob: 98,
      isPrediction: false,
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'lst-102',
      name: 'Blue Harbor Bistro',
      type: 'Bistro',
      meals: 60,
      items: 'Warm Soups & Grain Bowls',
      distanceKm: 3.4,
      eta: '18 mins',
      angleDeg: 235,
      distanceRatio: 0.82,
      urgency: 'High',
      prob: 91,
      isPrediction: false,
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'pred-102',
      name: 'Grand Imperial Hall',
      type: 'Convention',
      meals: 140,
      items: 'Gala Banquet Warmers',
      distanceKm: 4.2,
      eta: '25 mins',
      angleDeg: 320,
      distanceRatio: 0.88,
      urgency: 'High',
      prob: 87,
      isPrediction: true,
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  const activeTarget = targets.find((t) => t.id === activeBlipId) || targets[0];

  const handleLaunchToTarget = () => {
    if (activeTarget.isPrediction) {
      setCurrentView('future-radar');
    } else {
      const match = listings.find((l) => l.id === activeTarget.id);
      if (match) setSelectedListing(match);
      setCurrentView('live-radar');
    }
  };

  return (
    <div className={`relative w-full rounded-3xl bg-white border border-slate-200/90 shadow-lg overflow-hidden flex flex-col ${className}`}>
      {/* 1. Radar Telemetry Top Bar (Clean White & Pastel) */}
      <div className="px-4 py-3 border-b border-slate-200/80 bg-white/95 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600" />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
              <span>FOOD RESCUE RADAR</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                SWEEP ONLINE
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              Continuous 360° Surplus Interception Grid · 5 KM Perimeter
            </div>
          </div>
        </div>

        {/* Sweep Mode Toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setSweepSpeed(sweepSpeed === 'normal' ? 'fast' : 'normal')}
            className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            title="Toggle Radar Sweep Rotation Velocity"
          >
            Sweep: {sweepSpeed === 'normal' ? '1.0x' : '1.8x'}
          </button>
        </div>
      </div>

      {/* 2. Main Radar Circular Display in Crisp Light Pastel Canvas */}
      <div className="relative flex-1 min-h-[360px] sm:min-h-[400px] flex items-center justify-center p-3 select-none overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/40">
        {/* Radial Radar Disc SVG */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full select-none" viewBox="0 0 500 500">
            {/* Crisp Radar Outer Disc */}
            <circle cx="250" cy="250" r="230" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <circle cx="250" cy="250" r="230" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.35" />

            {/* Concentric Distance Rings */}
            <circle cx="250" cy="250" r="180" fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="2 4" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="#E2E8F0" strokeWidth="1.2" />
            <circle cx="250" cy="250" r="60" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 4" />

            {/* Center Origin Dot & Municipal Ring */}
            <circle cx="250" cy="250" r="12" fill="#8B5CF6" opacity="0.12" />
            <circle cx="250" cy="250" r="4.5" fill="#8B5CF6" />

            {/* Crosshair Axes */}
            <line x1="20" y1="250" x2="480" y2="250" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="250" y1="20" x2="250" y2="480" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

            {/* Distance Ring Markers */}
            <text x="255" y="195" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="600">1.5 km</text>
            <text x="255" y="135" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="600">3.0 km</text>
            <text x="255" y="75" fill="#94A3B8" fontSize="10" fontFamily="monospace" fontWeight="600">4.5 km</text>

            {/* Cardinal Directions */}
            <text x="250" y="38" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontFamily="monospace" fontWeight="bold">N</text>
            <text x="470" y="254" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
            <text x="250" y="472" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="bold">S</text>
            <text x="30" y="254" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="monospace" fontWeight="bold">W</text>
          </svg>

          {/* ROTATING RADAR SWEEPER BEAM (Soft Pastel Lavender & Sky) */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              sweepSpeed === 'fast' ? 'animate-radar-sweep-fast' : 'animate-radar-sweep-pastel'
            }`}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0.28) 0deg, rgba(56, 189, 248, 0.16) 35deg, transparent 75deg)',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* INTERACTIVE RADAR BLIPS & TARGET PILLS (Scattered Cleanly in Pastel) */}
          <div className="absolute inset-0 pointer-events-auto">
            {targets.map((tgt) => {
              const rad = (tgt.angleDeg * Math.PI) / 180;
              const radiusPx = 230 * tgt.distanceRatio * (340 / 500);
              const xPercent = 50 + ((radiusPx * Math.cos(rad)) / 170) * 50;
              const yPercent = 50 + ((radiusPx * Math.sin(rad)) / 170) * 50;
              const isSelected = activeBlipId === tgt.id;

              return (
                <div
                  key={tgt.id}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  onClick={() => setActiveBlipId(tgt.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Subtle Pulse ring */}
                  <span
                    className={`absolute -inset-2 rounded-full ${
                      isSelected ? 'bg-purple-300/60 animate-ping' : 'bg-transparent'
                    } pointer-events-none`}
                  />

                  {/* Marker Node with Name Tag in White & Pastel */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xs border text-xs transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        tgt.urgency === 'Critical' ? 'bg-rose-500 animate-pulse' : 'bg-purple-500'
                      }`}
                    />
                    <span className="font-bold text-[11px] truncate max-w-[90px] sm:max-w-[110px]">
                      {tgt.name.split(' ')[0]} {tgt.name.split(' ')[1] || ''}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                        isSelected ? 'bg-purple-800 text-white' : 'bg-purple-50 text-purple-700'
                      }`}
                    >
                      {tgt.meals}m
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Interactive Target Inspection HUD Card (Clean White & Pastel Bottom) */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${activeTarget.badge}`}>
              {activeTarget.type} · {activeTarget.urgency} Urgency
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {activeTarget.distanceKm} km · {activeTarget.eta} ETA
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {activeTarget.name}
            </h3>
            <span className="text-xs font-mono font-bold text-purple-700 shrink-0">
              {activeTarget.meals} meals ready
            </span>
          </div>

          <p className="text-[11px] text-slate-500 truncate">
            {activeTarget.items} · Intercept Confidence {activeTarget.prob}%
          </p>
        </div>

        <button
          onClick={handleLaunchToTarget}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          <span>Intercept Target</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-100" />
        </button>
      </div>
    </div>
  );
};
