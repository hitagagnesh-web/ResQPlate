import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Utensils,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Compass,
  Sparkles,
  Flame,
  Building,
  Target,
  Bike,
  Truck,
  Flag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodListing, SurplusPrediction } from '../../types';

interface CircularRescueRadarProps {
  className?: string;
  mode?: 'live' | 'future' | 'route' | 'all';
  predictions?: SurplusPrediction[];
  listings?: FoodListing[];
  timeFilter?: string;
  typeFilter?: string;
  onSelectListing?: (listing: FoodListing) => void;
  onSelectPrediction?: (pred: SurplusPrediction) => void;
  selectedId?: string;
  showHeader?: boolean;
}

export const CircularRescueRadar: React.FC<CircularRescueRadarProps> = ({
  className = '',
  mode = 'live',
  predictions: customPredictions,
  listings: customListings,
  timeFilter = 'all',
  typeFilter = 'all',
  onSelectListing,
  onSelectPrediction,
  selectedId,
  showHeader = true,
}) => {
  const {
    listings: contextListings,
    predictions: contextPredictions,
    activeRoute,
    selectedListing,
    setSelectedListing,
    selectedPrediction,
    setSelectedPrediction,
    claimRescue,
    prepareRescueFromPrediction,
    setCurrentView,
    setSelectedPassport,
    passports,
  } = useApp();

  // Internal filters
  const [distanceRadius, setDistanceRadius] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [popupListing, setPopupListing] = useState<FoodListing | null>(null);
  const [popupPrediction, setPopupPrediction] = useState<SurplusPrediction | null>(null);

  // Trigger brief radar calibration animation when timeFilter or mode changes
  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [timeFilter, typeFilter, mode]);

  const handleScanRadar = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  // Center reference coordinates (BKC Mumbai: ~ 19.065, 72.865)
  const centerLat = 19.065;
  const centerLng = 72.865;

  const activePredictionsList = customPredictions || contextPredictions;
  const activeListingsList = customListings || contextListings;

  const maxRadarDistKm = useMemo(() => {
    if (timeFilter === 'Next 1h') return 5;
    if (timeFilter === 'Next 3h') return 8;
    return 15;
  }, [timeFilter]);

  // Concentric ring radii labels
  const ringLabels = useMemo(() => {
    if (maxRadarDistKm === 5) {
      return { r1: '1 KM', r2: '2.5 KM', r3: '4 KM', r4: '5 KM' };
    }
    if (maxRadarDistKm === 8) {
      return { r1: '2 KM', r2: '4 KM', r3: '6 KM', r4: '8 KM' };
    }
    return { r1: '2 KM', r2: '5 KM', r3: '10 KM', r4: '15 KM' };
  }, [maxRadarDistKm]);

  // Filter future predictions when in future mode
  const filteredPredictions = useMemo(() => {
    return activePredictionsList.filter((item) => {
      const dLat = (item.location.lat - centerLat) * 111;
      const dLng = (item.location.lng - centerLng) * 105;
      const distKm = Math.sqrt(dLat * dLat + dLng * dLng);

      if (distanceRadius !== 'all' && distKm > distanceRadius) return false;
      if (timeFilter !== 'all' && item.timeframeCategory !== timeFilter) return false;
      if (typeFilter !== 'all' && !item.venueType.toLowerCase().includes(typeFilter.toLowerCase())) return false;

      return true;
    });
  }, [activePredictionsList, distanceRadius, timeFilter, typeFilter]);

  // Filter live listings when in live or all mode
  const filteredListings = useMemo(() => {
    return activeListingsList.filter((item) => {
      const dLat = (item.location.lat - centerLat) * 111;
      const dLng = (item.location.lng - centerLng) * 105;
      const distKm = Math.sqrt(dLat * dLat + dLng * dLng);

      if (distanceRadius !== 'all' && distKm > distanceRadius) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedUrgency !== 'all' && item.urgency !== selectedUrgency) return false;

      return true;
    });
  }, [activeListingsList, distanceRadius, selectedCategory, selectedUrgency]);

  // Project targets onto a 500x500 polar coordinate canvas WITH GENEROUS SCATTER
  // Distributes blips evenly across outer concentric rings (130px to 218px) and all 360 degrees so they NEVER bunch in the center
  const projectedFutureItems = useMemo(() => {
    const total = filteredPredictions.length || 1;
    return filteredPredictions.map((item, index) => {
      // Scatter angle evenly across the full 360 degree circle (2 * Math.PI)
      const fullCircleAngle = (index * 2 * Math.PI) / total + 0.38 + ((index * 0.45) % 0.85);
      // Ring radii tiers: well dispersed across middle-outer rings (135px to 218px) - completely free of center crowding
      const ringTiers = [135, 165, 195, 218];
      const visualRadius = ringTiers[index % ringTiers.length] + ((index * 11) % 18) - 9;

      const x = 250 + visualRadius * Math.cos(fullCircleAngle);
      const y = 250 - visualRadius * Math.sin(fullCircleAngle);

      return {
        item,
        distKm: Number(((visualRadius / 225) * maxRadarDistKm).toFixed(1)),
        x: Math.max(45, Math.min(455, x)),
        y: Math.max(45, Math.min(455, y)),
        index,
      };
    });
  }, [filteredPredictions, maxRadarDistKm]);

  const projectedLiveItems = useMemo(() => {
    const total = filteredListings.length || 1;
    return filteredListings.map((item, index) => {
      // Scatter angle evenly across the full 360 degree circumference
      const fullCircleAngle = (index * 2 * Math.PI) / total + 0.55 + ((index * 0.35) % 0.75);
      // Generously dispersed across perimeter rings
      const ringTiers = [130, 160, 192, 216];
      const visualRadius = ringTiers[index % ringTiers.length] + ((index * 13) % 20) - 10;

      const x = 250 + visualRadius * Math.cos(fullCircleAngle);
      const y = 250 - visualRadius * Math.sin(fullCircleAngle);

      return {
        item,
        distKm: Number(((visualRadius / 225) * maxRadarDistKm).toFixed(1)),
        x: Math.max(45, Math.min(455, x)),
        y: Math.max(45, Math.min(455, y)),
        index,
      };
    });
  }, [filteredListings, maxRadarDistKm]);

  const activeListingItem =
    popupListing || (selectedId ? activeListingsList.find((l) => l.id === selectedId) : selectedListing);
  const activePredItem =
    popupPrediction || (selectedId ? activePredictionsList.find((p) => p.id === selectedId) : selectedPrediction);

  const handleListingClick = (listing: FoodListing) => {
    setSelectedListing(listing);
    setPopupListing(listing);
    setPopupPrediction(null);
    if (onSelectListing) onSelectListing(listing);
  };

  const handlePredictionClick = (pred: SurplusPrediction) => {
    setSelectedPrediction(pred);
    setPopupPrediction(pred);
    setPopupListing(null);
    if (onSelectPrediction) onSelectPrediction(pred);
  };

  const handleClaim = (listing: FoodListing) => {
    claimRescue(listing.id, 'ngo-1');
    setPopupListing(null);
  };

  const handlePrepareRescue = (pred: SurplusPrediction) => {
    const created = prepareRescueFromPrediction(pred.id);
    setSelectedListing(created);
    setPopupPrediction(null);
    setCurrentView('matching');
  };

  const handleViewPassport = (listing: FoodListing) => {
    const passport = passports.find((p) => p.listingId === listing.id);
    if (passport) {
      setSelectedPassport(passport);
      setCurrentView('food-passport');
    }
  };

  const totalTargetCount = mode === 'future' ? filteredPredictions.length : filteredListings.length;

  return (
    <div
      className={`relative w-full rounded-3xl border border-slate-200/90 bg-white shadow-lg overflow-hidden flex flex-col ${className}`}
    >
      {/* 1. Header (when showHeader is true - Clean White & Pastel) */}
      {showHeader && (
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  Food Rescue Sweep Radar
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                  {mode === 'future' ? 'PREDICTIVE SWEEP' : 'LIVE SWEEP'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {mode === 'future'
                  ? `Forecast Scope: ${timeFilter === 'all' ? 'All Horizon' : timeFilter} (${maxRadarDistKm}km perimeter) · ${filteredPredictions.length} Hotspots`
                  : `Active Perimeter · ${filteredListings.length} Surplus Targets Scattered Across Rings`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                showFilters
                  ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Perimeter</span>
            </button>

            <button
              onClick={handleScanRadar}
              disabled={isScanning}
              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-60"
              title="Recalibrate Sweep"
            >
              <RefreshCw className={`w-3 h-3 text-purple-600 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Sweep'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Expandable Perimeter Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 text-xs overflow-hidden z-20 space-y-2 text-slate-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 text-[11px]">Radius:</span>
                {(['all', 2, 5, 10] as const).map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setDistanceRadius(dist)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                      distanceRadius === dist
                        ? 'bg-purple-600 text-white font-semibold shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {dist === 'all' ? `All (${maxRadarDistKm}km)` : `≤ ${dist}km`}
                  </button>
                ))}
              </div>

              {mode !== 'future' && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 text-[11px]">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-purple-400"
                  >
                    <option value="all">All Types</option>
                    <option value="Prepared Meal">Prepared Meals</option>
                    <option value="Buffet Surplus">Buffet Surplus</option>
                    <option value="Bakery & Pastry">Bakery & Pastry</option>
                    <option value="Fresh Produce">Produce</option>
                  </select>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Mode Banner Indicator (White & Pastel) */}
      <div className="px-4 py-1.5 bg-slate-50/80 border-b border-slate-200/80 text-[11px] flex items-center justify-between z-15">
        <div className="flex items-center gap-2 font-medium text-slate-600 truncate">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0" />
          <span className="truncate">
            {mode === 'future'
              ? `Forecast Scope: ${timeFilter === 'all' ? 'All Horizon' : timeFilter} (Zoom: ${maxRadarDistKm}km perimeter) · ${typeFilter === 'all' ? 'All Venues' : typeFilter}`
              : `Live Food Rescue Grid · Immediate Perimeter`}
          </span>
        </div>
        <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-bold shrink-0">
          {totalTargetCount} {mode === 'future' ? 'Hotspots' : 'Listings'} Scattered
        </span>
      </div>

      {/* 2. Main Radar Circular Display Canvas (Luminous White & Pastel) */}
      <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] flex items-center justify-center p-3 sm:p-4 overflow-hidden bg-[#FAFAFE]">
        {/* Soft Ambient Pastel Blobs */}
        <div className="absolute w-[320px] h-[320px] rounded-full bg-purple-100/60 blur-3xl pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />

        {/* Dynamic Scanning Recalibration Flash */}
        {isScanning && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-30 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-lg text-slate-800">
              <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-xs font-mono font-bold text-purple-700">
                SCATTERING RADAR TARGETS ACROSS PERIMETER...
              </span>
            </div>
          </div>
        )}

        {/* Responsive Circular Radar Container */}
        <div className="relative w-full max-w-[360px] sm:max-w-[430px] aspect-square flex items-center justify-center">
          {/* SVG Concentric Rings (Pastel Lavender & Soft Slate) */}
          <svg className="absolute inset-0 w-full h-full select-none" viewBox="0 0 500 500">
            {/* Background Disc in soft pastel white */}
            <circle cx="250" cy="250" r="230" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <circle
              cx="250"
              cy="250"
              r="230"
              fill="none"
              stroke="#DDD6FE"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.8"
            />

            {/* Concentric Distance Rings with Pastel Accents */}
            <circle cx="250" cy="250" r="205" fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="#E2E8F0" strokeWidth="1.2" opacity="0.9" />
            <circle cx="250" cy="250" r="80" fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="250" cy="250" r="38" fill="rgba(243, 232, 255, 0.5)" stroke="#C084FC" strokeWidth="1.2" />

            {/* Crosshairs & Compass Rays in soft slate */}
            <line x1="250" y1="20" x2="250" y2="480" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="20" y1="250" x2="480" y2="250" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="88" y1="88" x2="412" y2="412" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="412" y1="88" x2="88" y2="412" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 4" />

            {/* Distance Typography in soft slate */}
            <text x="254" y="216" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600">
              {ringLabels.r1}
            </text>
            <text x="254" y="174" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600">
              {ringLabels.r2}
            </text>
            <text x="254" y="114" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600">
              {ringLabels.r3}
            </text>
            <text x="254" y="49" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600">
              {ringLabels.r4}
            </text>

            {/* Compass Cardinal Points */}
            <text x="250" y="14" fill="#8B5CF6" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              N
            </text>
            <text x="488" y="253" fill="#8B5CF6" fontSize="10" fontFamily="monospace" fontWeight="bold">
              E
            </text>
            <text x="250" y="494" fill="#8B5CF6" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              S
            </text>
            <text x="8" y="253" fill="#8B5CF6" fontSize="10" fontFamily="monospace" fontWeight="bold">
              W
            </text>
          </svg>

          {/* Rotating Soft Pastel Lavender & Sky Radar Sweep */}
          <div
            className={`absolute inset-0 pointer-events-none origin-center ${
              timeFilter === 'Next 1h' ? 'animate-radar-sweep-fast' : 'animate-radar-sweep-pastel'
            } overflow-hidden rounded-full`}
            style={{ clipPath: 'circle(46% at 50% 50%)' }}
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, rgba(168, 85, 247, 0.2) 0deg, rgba(56, 189, 248, 0.12) 30deg, transparent 75deg, transparent 360deg)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-[46%] h-[1.5px] bg-purple-400 origin-left shadow-[0_0_6px_rgba(168,85,247,0.5)]"
              style={{ transform: 'rotate(0deg)' }}
            />
          </div>

          {/* Center Hub Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-purple-200/60 animate-ping" />
            <div className="w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white shadow-md" />
          </div>

          {/* 3. RADAR TARGETS LAYER (WELL SCATTERED ACROSS CONCENTRIC RINGS) */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {/* If in FUTURE mode: Render Prediction Blips Scattered */}
            {mode === 'future' &&
              projectedFutureItems.map(({ item: pred, distKm, x, y, index }) => {
                const isSelected = activePredItem?.id === pred.id;
                const isHigh = pred.probability >= 80;
                const leftPercent = (x / 500) * 100;
                const topPercent = (y / 500) * 100;

                return (
                  <div
                    key={pred.id}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onClick={() => handlePredictionClick(pred)}
                  >
                    {isHigh && (
                      <span className="absolute -inset-2 rounded-full bg-purple-200/60 animate-ping pointer-events-none" />
                    )}

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
                      whileHover={{ scale: 1.12 }}
                      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-200 z-30 scale-105'
                          : isHigh
                          ? 'bg-white text-slate-800 border-purple-300 hover:border-purple-400'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <Target className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                      <span className="font-bold text-[11px] truncate max-w-[85px] sm:max-w-[105px]">
                        {pred.venueName.split(' ')[0]}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                          isSelected
                            ? 'bg-purple-800 text-white'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {pred.probability}%
                      </span>
                    </motion.div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-40 pointer-events-none w-48 p-2.5 rounded-xl bg-white border border-purple-200 shadow-xl text-[11px] text-slate-700">
                      <div className="font-bold text-slate-900 truncate">{pred.venueName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span className="truncate max-w-[110px]">{pred.eventDetails.eventType}</span>
                        <span className="font-mono">{distKm} km ring</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-purple-700 mt-1 pt-1 border-t border-slate-100">
                        {pred.estimatedServingsMin}–{pred.estimatedServingsMax} est. meals
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* If in LIVE mode: Render Available Food Surplus Blips Scattered */}
            {mode !== 'future' &&
              projectedLiveItems.map(({ item: listing, distKm, x, y, index }) => {
                const isSelected = activeListingItem?.id === listing.id;
                const isCritical = listing.urgency === 'Critical';
                const leftPercent = (x / 500) * 100;
                const topPercent = (y / 500) * 100;

                return (
                  <div
                    key={listing.id}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onClick={() => handleListingClick(listing)}
                  >
                    {isCritical && (
                      <span className="absolute -inset-2 rounded-full bg-rose-200/60 animate-ping pointer-events-none" />
                    )}

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
                      whileHover={{ scale: 1.12 }}
                      className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs border transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-200 z-30 scale-105'
                          : isCritical
                          ? 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                      )}
                      <span className="font-bold text-[11px] truncate max-w-[85px] sm:max-w-[105px]">
                        {listing.donorName.split(' ')[0]}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                          isSelected
                            ? 'bg-sky-800 text-white'
                            : isCritical
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {listing.servings}m
                      </span>
                    </motion.div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-40 pointer-events-none w-48 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xl text-[11px] text-slate-700">
                      <div className="font-bold text-slate-900 truncate">{listing.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span className="truncate max-w-[100px]">{listing.donorName}</span>
                        <span className="font-mono">{distKm} km</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-purple-700 mt-1 pt-1 border-t border-slate-100">
                        {listing.servings} meals ({listing.weightKg} kg)
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* ACTIVE COURIERS IN TRANSIT: SCATTERED ACROSS TRANSIT CORRIDORS */}
            {mode !== 'future' && (
              <>
                {/* 1. Rahul Verma - Cargo E-Bike En Route to Hope Foundation Shelter */}
                <div
                  style={{ left: '74%', top: '28%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-35 group"
                  onClick={() => setCurrentView('route-optimizer')}
                  title="Rahul Verma heading to Hope Foundation Shelter by Cargo E-Bike"
                >
                  <span className="absolute -inset-2 rounded-full bg-purple-200/70 animate-ping pointer-events-none" />
                  <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-purple-400 text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                    <Bike className="w-3.5 h-3.5 text-purple-600 animate-bounce shrink-0" />
                    <span className="font-extrabold text-[11px] truncate max-w-[85px] text-slate-900">
                      Rahul (E-Bike)
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 text-[9px] font-mono font-bold">
                      → Hope Shelter
                    </span>
                  </div>
                </div>

                {/* 2. Priya Sharma - Electric Van En Route to St. Jude Child Care */}
                <div
                  style={{ left: '26%', top: '74%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-35 group"
                  onClick={() => setCurrentView('route-optimizer')}
                  title="Priya Sharma heading to St. Jude Shelter by Electric Van"
                >
                  <span className="absolute -inset-2 rounded-full bg-sky-200/70 animate-pulse pointer-events-none" />
                  <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-sky-400 text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                    <Truck className="w-3.5 h-3.5 text-sky-600 animate-bounce shrink-0" />
                    <span className="font-extrabold text-[11px] truncate max-w-[85px] text-slate-900">
                      Priya (Van)
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 text-[9px] font-mono font-bold">
                      → St. Jude
                    </span>
                  </div>
                </div>

                {/* 3. Amit Patel - Delivery Scooter En Route to Ashray Shelter */}
                <div
                  style={{ left: '24%', top: '26%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-35 group"
                  onClick={() => setCurrentView('route-optimizer')}
                  title="Amit Patel heading to Ashray Shelter by Delivery Scooter"
                >
                  <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-amber-300 text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                    <Bike className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-extrabold text-[11px] truncate max-w-[85px] text-slate-900">
                      Amit (Scooter)
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 text-[9px] font-mono font-bold">
                      → Ashray
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Empty State inside Radar */}
          {totalTargetCount === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-25 bg-white/95 rounded-full">
              <Compass className="w-8 h-8 text-slate-400 mb-1.5" />
              <h4 className="text-xs font-bold text-slate-800">No Hotspots for "{timeFilter}"</h4>
              <p className="text-[10px] text-slate-500 max-w-[190px] mt-0.5">
                Switch timeframe filters above to scan other surplus windows.
              </p>
              <button
                onClick={() => {
                  setDistanceRadius('all');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-3 py-1 rounded-xl bg-purple-600 text-white text-[10px] font-semibold cursor-pointer shadow-xs"
              >
                Reset Perimeter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Interactive Bottom Card for Active Selection (Clean White & Pastel) */}
      <AnimatePresence>
        {mode === 'future' && activePredItem && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="p-3.5 sm:p-4 border-t border-slate-200/80 bg-white z-20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 max-w-lg space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {activePredItem.probability}% Surplus Probability
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-600">{activePredItem.timeframeCategory}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-sky-600 font-mono font-semibold">{activePredItem.expectedTimeWindow}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{activePredItem.venueName}</h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {activePredItem.eventDetails.eventType} · Est.{' '}
                  <strong className="text-slate-800">
                    {activePredItem.estimatedServingsMin}–{activePredItem.estimatedServingsMax} meals
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handlePrepareRescue(activePredItem)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Prepare Rescue</span>
                </button>
                {popupPrediction && (
                  <button
                    onClick={() => setPopupPrediction(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Close detail card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {mode !== 'future' && activeListingItem && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="p-3.5 sm:p-4 border-t border-slate-200/80 bg-white z-20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 max-w-lg space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full border ${
                      activeListingItem.urgency === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}
                  >
                    {activeListingItem.urgency} Urgency
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-600">{activeListingItem.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-purple-600 font-mono font-semibold">
                    Expires {activeListingItem.expiresInMinutes ?? 45}m
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{activeListingItem.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">
                  Donor: <strong className="text-slate-800">{activeListingItem.donorName}</strong> ·{' '}
                  <strong className="text-purple-700">
                    {activeListingItem.servings} meals ({activeListingItem.weightKg} kg)
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleViewPassport(activeListingItem)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-all flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Passport</span>
                </button>

                <button
                  onClick={() => handleClaim(activeListingItem)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Claim Rescue</span>
                </button>

                {popupListing && (
                  <button
                    onClick={() => setPopupListing(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Close detail card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
