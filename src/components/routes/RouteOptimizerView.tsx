import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Car,
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Leaf,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarMap } from '../radar/RadarMap';
import { RouteStop } from '../../types';

export const RouteOptimizerView: React.FC = () => {
  const {
    activeRoute,
    setCurrentView,
    triggerConfetti,
    advanceListingStatus,
    selectedListing,
  } = useApp();

  const [stops, setStops] = useState<RouteStop[]>(activeRoute.stops);

  const moveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...stops];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    // re-assign order numbers
    newStops.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setStops(newStops);
  };

  const toggleStopCompletion = (id: string) => {
    const updated = stops.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s));
    setStops(updated);

    const allDone = updated.every((s) => s.completed);
    if (allDone) {
      triggerConfetti();
      if (selectedListing) {
        advanceListingStatus(selectedListing.id, 'Delivered');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* Header in Black, Purple, Blue */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 min-w-0 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-words">
            Optimized Rescue Route
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
            Consolidating pick-ups from multiple restaurants and convention halls along the Bandra-BKC corridor into a single ultra-low-emission transit run.
          </p>
        </div>

        {/* Global Route Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0">
          <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-left min-w-0">
            <div className="text-[10px] text-slate-400 uppercase font-mono truncate">Distance</div>
            <div className="text-sm sm:text-base font-bold text-slate-100 font-mono truncate">
              {activeRoute.totalDistanceKm} km
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-left min-w-0">
            <div className="text-[10px] text-blue-400 uppercase font-mono truncate">Est. Duration</div>
            <div className="text-sm sm:text-base font-bold text-blue-300 font-mono truncate">
              {activeRoute.estimatedDurationMin} mins
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-left min-w-0">
            <div className="text-[10px] text-purple-400 uppercase font-mono truncate">Meals Saved</div>
            <div className="text-sm sm:text-base font-bold text-purple-300 font-mono truncate">
              {activeRoute.totalMealsRescued}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-left min-w-0">
            <div className="text-[10px] text-emerald-400 uppercase font-mono truncate">CO₂e Avoided</div>
            <div className="text-sm sm:text-base font-bold text-emerald-300 font-mono flex items-center gap-1 truncate">
              <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{activeRoute.co2SavedKg} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map on Left, Waypoint Sequence on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Map Telemetry & Progress */}
        <div className="lg:col-span-7 space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Transit Telemetry — Live Vehicle Movement</span>
            </span>
            <span className="font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/40 text-[11px]">
              Driver: {activeRoute.volunteerName}
            </span>
          </div>

          <RadarMap
            mode="route"
            defaultView="grid"
            className="h-[420px] sm:h-[450px]"
            onMarkerSelect={(item, type) => {
              if (type === 'stop') {
                const el = document.getElementById(`route-stop-${item.id}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
              }
            }}
          />

          {/* Turn-by-Turn Progress Bar */}
          <div className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#0E142E] text-blue-400 border border-[#222E54] flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-100 truncate">Route In Progress (Stop 2 of 4)</div>
                <div className="text-slate-400 text-[11px] truncate">En route to Grand Imperial Convention Hall</div>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedListing) {
                  advanceListingStatus(selectedListing.id, 'Delivered');
                }
                triggerConfetti();
                setCurrentView('food-passport');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-purple-200" />
              <span>Simulate Delivery Completion</span>
            </button>
          </div>
        </div>

        {/* Right Column: Waypoint Sequence List */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-100 truncate">Optimized Waypoint Sequence</h3>
                <p className="text-[11px] text-slate-400 truncate">Click arrows to re-order dispatch stops</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0E142E] border border-[#222E54] text-purple-300 shrink-0">
                A* Algorithm
              </span>
            </div>

            <div className="space-y-3">
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  id={`route-stop-${stop.id}`}
                  className={`p-3.5 rounded-2xl border transition-all min-w-0 ${
                    stop.completed
                      ? 'bg-[#070A18]/80 border-[#1E2648] opacity-60'
                      : 'bg-[#0E142E] border-[#222E54] hover:border-purple-500/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Step Number Circle */}
                      <button
                        onClick={() => toggleStopCompletion(stop.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold mt-0.5 shrink-0 cursor-pointer transition-colors ${
                          stop.completed
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#070A18] text-slate-300 hover:bg-purple-950 hover:text-purple-300 border border-[#222E54]'
                        }`}
                        title="Toggle completed"
                        aria-label={`Toggle stop ${stop.order} completion`}
                      >
                        {stop.completed ? <CheckCircle2 className="w-4 h-4" /> : stop.order}
                      </button>

                      {/* Content: location, address, meta */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                              stop.type === 'pickup'
                                ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                                : 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                            }`}
                          >
                            {stop.type}
                          </span>
                          <span className="text-xs font-bold text-slate-100 break-words leading-tight">
                            {stop.locationName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 break-words leading-snug">
                          {stop.address}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono pt-0.5">
                          <span className="text-purple-300 font-semibold">{stop.mealsCount} meals</span>
                          <span className="text-slate-600">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>ETA: {stop.estimatedTime}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveStop(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[#070A18] hover:bg-[#141C3C] text-slate-300 disabled:opacity-20 cursor-pointer transition-colors border border-[#222E54]"
                        title="Move stop up"
                        aria-label="Move stop up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveStop(index, 'down')}
                        disabled={index === stops.length - 1}
                        className="p-1.5 rounded-lg bg-[#070A18] hover:bg-[#141C3C] text-slate-300 disabled:opacity-20 cursor-pointer transition-colors border border-[#222E54]"
                        title="Move stop down"
                        aria-label="Move stop down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Efficiency Impact Summary Box */}
            <div className="p-3.5 rounded-2xl bg-[#070A18] border border-purple-500/40 text-xs space-y-1.5 min-w-0">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Consolidated Route Impact</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed break-words">
                Consolidating these stops eliminates <strong>11.2 km of redundant single-donor driving</strong> and prevents <strong>4.1 kg of urban CO₂ emissions</strong> compared to disconnected trips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
