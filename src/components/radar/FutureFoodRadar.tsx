import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  Building,
  Compass,
  AlertTriangle,
  Leaf,
  Users,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarMap } from './RadarMap';
import { SurplusPrediction } from '../../types';

export const FutureFoodRadar: React.FC = () => {
  const {
    predictions,
    selectedPrediction,
    setSelectedPrediction,
    prepareRescueFromPrediction,
    setCurrentView,
    setSelectedListing,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'all' | 'Next 1h' | 'Next 3h' | 'Tonight' | 'Tomorrow'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isPreparing, setIsPreparing] = useState(false);

  // Dynamic filtering with memoization
  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      if (timeFilter !== 'all' && p.timeframeCategory !== timeFilter) return false;
      if (typeFilter !== 'all' && !p.venueType.toLowerCase().includes(typeFilter.toLowerCase())) return false;
      return true;
    });
  }, [predictions, timeFilter, typeFilter]);

  // Robust active prediction calculation
  const activePred = useMemo(() => {
    if (selectedPrediction && filteredPredictions.some((p) => p.id === selectedPrediction.id)) {
      return selectedPrediction;
    }
    return filteredPredictions[0] || predictions[0] || null;
  }, [selectedPrediction, filteredPredictions, predictions]);

  const handlePrepareRescue = (pred: SurplusPrediction) => {
    setIsPreparing(true);
    setTimeout(() => {
      const listing = prepareRescueFromPrediction(pred.id);
      setSelectedListing(listing);
      setIsPreparing(false);
      setCurrentView('matching');
    }, 600);
  };

  const handleSpotSelect = (pred: SurplusPrediction) => {
    setSelectedPrediction(pred);
    setTimeout(() => {
      const el = document.getElementById('prediction-detail-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-0">
      {/* Header Banner - Black, Purple, Blue Theme */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 min-w-0 max-w-2xl relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex flex-wrap items-center gap-2.5 break-words">
            <span>Future Food Radar</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300">
              ML Predictive Interception
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
            Don't wait for food waste to happen. Predict it before it happens. Our predictive radar models event density, attendance variance, and kitchen margins to intercept surplus hours ahead.
          </p>
        </div>

        {/* Global stats cards */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 relative z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-[#0E142E] border border-[#222E54] text-left min-w-[140px] shadow-xs">
            <div className="text-[11px] text-purple-300 font-medium">Surplus Forecasted</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">380–510 meals</div>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#0E142E] border border-[#222E54] text-left min-w-[130px] shadow-xs">
            <div className="text-[11px] text-blue-400 font-medium">Accuracy Benchmark</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">94.2%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Map on Left, Detail & Explainability on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filters + Map + Prediction Cards */}
        <div className="xl:col-span-7 space-y-4 min-w-0">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
            {/* Timeframe Filters */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 min-w-0">
              <span className="text-xs text-slate-400 font-medium mr-1.5 flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Time:
              </span>
              {(['all', 'Next 1h', 'Next 3h', 'Tonight', 'Tomorrow'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    timeFilter === filter
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-white bg-[#0E142E] border border-[#222E54]'
                  }`}
                >
                  {filter === 'all' ? 'All Times' : filter}
                </button>
              ))}
            </div>

            {/* Category / Type Filters */}
            <div className="flex items-center gap-1 text-xs shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#0E142E] border border-[#222E54] rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Venue Types</option>
                <option value="Convention">Convention Halls</option>
                <option value="Hotel">Hotels & Bistros</option>
                <option value="Bakery">Bakeries</option>
                <option value="Hostel">University Hostels</option>
                <option value="Corporate">Corporate Campuses</option>
              </select>
            </div>
          </div>

          {/* Interactive Radar Component with Dynamic Timeframe Scope */}
          <RadarMap
            mode="future"
            predictions={filteredPredictions}
            timeFilter={timeFilter}
            typeFilter={typeFilter}
            defaultView="circular"
            className="h-[430px] sm:h-[460px]"
            onMarkerSelect={(p) => handleSpotSelect(p)}
          />

          {/* Quick Forecast Location Cards */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 truncate">
                <span>Predicted Surplus Hotspots</span>
                <span className="text-xs font-normal text-purple-300 font-mono">
                  ({filteredPredictions.length} detected)
                </span>
              </h3>
              <span className="text-xs text-purple-300 font-mono font-medium shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>Live Forecast Active</span>
              </span>
            </div>

            {filteredPredictions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0A0E22] border border-[#1E2648] text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0E142E] text-slate-400 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">No Hotspots In Selected Filter</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try switching the time window to "All Times" or resetting venue filters to explore all active predictions.
                </p>
                <button
                  onClick={() => {
                    setTimeFilter('all');
                    setTypeFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 cursor-pointer shadow-md"
                >
                  Reset Scope
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredPredictions.map((pred, idx) => {
                  const isSelected = activePred?.id === pred.id;
                  const isHighProb = pred.probability >= 80;

                  return (
                    <motion.div
                      key={pred.id}
                      id={`spot-desc-${pred.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      onClick={() => handleSpotSelect(pred)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all min-w-0 ${
                        isSelected
                          ? 'bg-[#101738] border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                          : 'bg-[#0A0E22]/95 border-[#1E2648] hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium truncate block">
                            {pred.venueType} · {pred.timeframeCategory}
                          </span>
                          <h4 className="text-sm font-bold text-slate-100 mt-1 leading-snug break-words">
                            {pred.venueName}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5 break-words">{pred.location.address}</p>
                        </div>

                        {/* Probability badge */}
                        <div className="text-right shrink-0">
                          <div
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono font-bold text-xs ${
                              isHighProb
                                ? 'bg-purple-950/80 border border-purple-500/40 text-purple-300'
                                : 'bg-[#0E142E] text-slate-300 border border-[#222E54]'
                            }`}
                          >
                            <Flame className={`w-3 h-3 ${isHighProb ? 'text-purple-400' : 'text-slate-400'}`} />
                            <span>{pred.probability}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">Surplus Prob</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#1E2648] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="truncate">
                          <span className="text-slate-400">Est. Volume: </span>
                          <span className="font-semibold text-purple-300 font-mono">
                            {pred.estimatedServingsMin}–{pred.estimatedServingsMax} meals
                          </span>
                        </div>
                        <div className="text-slate-400 flex items-center gap-1 font-mono text-[11px] shrink-0">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{pred.expectedTimeWindow}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep-Dive Prediction Card & AI Reasoning Panel */}
        <div id="prediction-detail-card" className="xl:col-span-5 space-y-4 min-w-0 scroll-mt-20">
          <AnimatePresence mode="wait">
            {activePred && (
              <motion.div
                key={activePred.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-5 min-w-0"
              >
                {/* Header Details */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-slate-100 mt-1 break-words">
                      {activePred.venueName}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 break-words">
                      <Building className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{activePred.location.address}, {activePred.location.city}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
                      {activePred.probability}%
                    </div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Confidence: <span className="text-blue-400 font-bold">{activePred.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Event Context Specs */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] text-xs min-w-0">
                  <div className="min-w-0">
                    <div className="text-slate-400 text-[11px]">Event Type</div>
                    <div className="font-semibold text-slate-200 mt-0.5 truncate">
                      {activePred.eventDetails.eventType}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-400 text-[11px]">Guest Headcount</div>
                    <div className="font-semibold text-slate-200 mt-0.5 font-mono truncate">
                      ~{activePred.eventDetails.guestCount} Attendees
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-400 text-[11px]">Estimated Surplus</div>
                    <div className="font-bold text-purple-300 mt-0.5 font-mono text-sm truncate">
                      {activePred.estimatedServingsMin}–{activePred.estimatedServingsMax} meals
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-400 text-[11px]">Expected Window</div>
                    <div className="font-semibold text-slate-300 mt-0.5 font-mono text-xs truncate">
                      {activePred.expectedTimeWindow}
                    </div>
                  </div>
                </div>

                {/* Recommended Rescuers Meter */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E142E] border border-[#222E54] min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#070A18] text-purple-300 border border-purple-500/40 flex items-center justify-center font-mono font-bold text-sm shadow-xs shrink-0">
                      {activePred.recommendedRescuers}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">Recommended Rescuers</div>
                      <div className="text-[11px] text-slate-400 truncate">Dispatches required for optimal handover</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400 shrink-0">Grid Ready</span>
                </div>

                {/* AI EXPLANATION PANEL ("Why are we predicting this?") */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Predictive Model Rationale</span>
                    </h3>
                    <span className="text-[10px] text-purple-300 font-mono font-semibold">Explainability</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0E142E] p-3 rounded-xl border border-[#222E54] break-words">
                    "{activePred.aiReasoning}"
                  </p>

                  {/* Contributing Prediction Factors Breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-semibold text-slate-300">Factor Weightage Analysis:</div>
                    {activePred.factors.map((f, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate mr-2">{f.name}</span>
                          <span className="font-mono text-purple-300 font-bold shrink-0">{f.weight}% weight</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#141C3C] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            style={{ width: `${f.weight * 2.2}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 break-words">{f.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACTION: PREPARE RESCUE CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => handlePrepareRescue(activePred)}
                    disabled={isPreparing}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer border border-purple-400/30"
                  >
                    {isPreparing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Staging Predictive Rescue...</span>
                      </>
                    ) : (
                      <>
                        <span>Prepare Rescue Before Waste Occurs</span>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-100" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Alerts nearby recipient kitchens and queues volunteer dispatch routing.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
