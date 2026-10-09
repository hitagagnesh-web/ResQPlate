import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Radio,
  Search,
  Filter,
  Clock,
  MapPin,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Leaf,
  ExternalLink,
  Flame,
  Thermometer,
  Boxes,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarMap } from './RadarMap';
import { FoodListing } from '../../types';

export const LiveRescueRadar: React.FC = () => {
  const {
    listings,
    selectedListing,
    setSelectedListing,
    claimRescue,
    advanceListingStatus,
    expandRescueRadius,
    setCurrentView,
    passports,
    setSelectedPassport,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'Critical' | 'High' | 'Medium'>('all');
  const [isExpanding, setIsExpanding] = useState(false);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUrgency = filterUrgency === 'all' || l.urgency === filterUrgency;
      return matchesSearch && matchesUrgency;
    });
  }, [listings, searchQuery, filterUrgency]);

  const activeListing = selectedListing || filteredListings[0] || listings[0];

  const handleClaim = (listing: FoodListing) => {
    claimRescue(listing.id, 'ngo-1');
  };

  const handleExpandRadius = (listing: FoodListing) => {
    setIsExpanding(true);
    setTimeout(() => {
      expandRescueRadius(listing.id);
      setIsExpanding(false);
    }, 600);
  };

  // Status mapping for visual step progress
  const statusSteps = ['Available', 'Claimed', 'In Transit', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(activeListing?.status || 'Available');

  const viewPassport = (listing: FoodListing) => {
    const passport = passports.find((p) => p.listingId === listing.id);
    if (passport) {
      setSelectedPassport(passport);
      setCurrentView('food-passport');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-0">
      {/* Top Emergency Status Bar in White & Soft Rose/Lavender Pastel */}
      {listings.some((l) => l.isEmergencyAlert || l.urgency === 'Critical') && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-purple-50 border border-rose-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3.5 min-w-0 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
                <span>Immediate Rescue Alert Active</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </div>
              <div className="text-sm font-semibold text-slate-800 truncate mt-0.5">
                High-protein surplus requires pickup within 38 minutes. Radius expanding.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const urgent = listings.find((l) => l.isEmergencyAlert) || listings[0];
              setSelectedListing(urgent);
              handleExpandRadius(urgent);
            }}
            disabled={isExpanding}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all shrink-0 relative z-10"
          >
            <Radio className="w-4 h-4 animate-pulse text-white" />
            <span>{isExpanding ? 'Expanding Network...' : 'Expand Radius to 10km'}</span>
          </button>
        </div>
      )}

      {/* Main Grid: Radar Map and Listings on Left, Live Tracking Drawer on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Map + Listing Cards */}
        <div className="xl:col-span-7 space-y-4 min-w-0">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search food, cuisine, or donor venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="text-slate-500">Urgency:</span>
              {(['all', 'Critical', 'High', 'Medium'] as const).map((urg) => (
                <button
                  key={urg}
                  onClick={() => setFilterUrgency(urg)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterUrgency === urg
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
                >
                  {urg === 'all' ? 'All' : urg}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Radar Component with Dynamic Filtered Listings */}
          <RadarMap
            mode="live"
            listings={filteredListings}
            defaultView="grid"
            className="h-[440px] sm:h-[470px]"
            onMarkerSelect={(l) => setSelectedListing(l)}
          />

          {/* Active Listings Grid */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
                <span>Active Food Surplus Available</span>
                <span className="text-xs font-normal text-purple-700 font-mono">
                  ({filteredListings.length} on radar)
                </span>
              </h3>
              <button
                onClick={() => setCurrentView('new-listing')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                + List New Surplus
              </button>
            </div>

            {/* Empty State */}
            {filteredListings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No Listings Match Current Filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or switching the urgency filter to view all active food donations.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterUrgency('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 cursor-pointer shadow-xs"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredListings.map((listing, index) => {
                  const isSelected = activeListing?.id === listing.id;
                  const isCritical = listing.urgency === 'Critical' || listing.isEmergencyAlert;

                  return (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedListing(listing)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all group min-w-0 ${
                        isSelected
                          ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-100 shadow-sm'
                          : isCritical
                          ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
                          : 'bg-white border-slate-200 hover:border-purple-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              isCritical
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}
                          >
                            {listing.urgency} Urgency
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1.5 truncate group-hover:text-purple-700 transition-colors">
                            {listing.title}
                          </h4>
                        </div>

                        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                          {listing.servings} meals
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {listing.donorName} · {listing.location.address}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          <span>Expires in {listing.expiresInMinutes ?? 45}m</span>
                        </span>
                        <span className="font-medium text-purple-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Inspect <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Animated Live Rescue Tracker in White & Pastel */}
        <div className="xl:col-span-5 space-y-4 min-w-0">
          <AnimatePresence mode="wait">
            {activeListing && (
              <motion.div
                key={activeListing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5 min-w-0"
              >
                {/* Header Info */}
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 truncate">
                      Passport: {activeListing.passportId}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        activeListing.urgency === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {activeListing.urgency} Urgency
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-tight break-words">
                    {activeListing.title}
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 break-words">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{activeListing.location.address}, {activeListing.location.city}</span>
                  </div>
                </div>

                {/* Photo & Metrics Banner */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={activeListing.imageUrl}
                    alt={activeListing.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                    <div className="w-full flex items-center justify-between text-xs text-white">
                      <div className="bg-white/95 border border-purple-200 px-2.5 py-1 rounded-xl shadow-md text-purple-800 font-mono font-bold">
                        {activeListing.servings} Servings Available
                      </div>
                      <div className="bg-white/95 border border-slate-200 px-2.5 py-1 rounded-xl shadow-md text-slate-700 font-mono font-semibold">
                        Safe Window: ~2h remaining
                      </div>
                    </div>
                  </div>
                </div>

                {/* ANIMATED STATUS STEPPER */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>Live Rescue Lifecycle</span>
                    <span className="text-purple-700 font-mono">
                      Step {currentStepIndex + 1} of {statusSteps.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {statusSteps.map((step, idx) => {
                      const isPast = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                            isCurrent
                              ? 'bg-white border border-purple-300 shadow-2xs text-purple-900 font-medium'
                              : isPast
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all shrink-0 ${
                              isPast
                                ? 'bg-purple-600 text-white'
                                : isCurrent
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isPast ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : idx + 1}
                          </div>
                          <span className="text-xs flex-1 truncate">{step}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Food Safety & Dietary Snapshot */}
                <div className="grid grid-cols-2 gap-3 text-xs min-w-0">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Storage Temp
                    </div>
                    <div className="font-semibold text-slate-800 mt-1 truncate">
                      {activeListing.safety.temperatureCelsius}°C ({activeListing.safety.storageCondition.split(' ')[0]})
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-sky-600 shrink-0" /> Packaging
                    </div>
                    <div className="font-semibold text-slate-800 mt-1 truncate">
                      {activeListing.safety.packagingType}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  {activeListing.status === 'Available' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleClaim(activeListing)}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <HeartHandshake className="w-4 h-4 text-purple-100" />
                        <span>Claim Rescue</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedListing(activeListing);
                          setCurrentView('matching');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Compass className="w-4 h-4 text-purple-600" />
                        <span>Smart Match</span>
                      </button>
                    </div>
                  )}

                  {activeListing.status !== 'Available' && activeListing.status !== 'Delivered' && (
                    <button
                      onClick={() => advanceListingStatus(activeListing.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>Advance to: {statusSteps[currentStepIndex + 1]}</span>
                      <ArrowRight className="w-4 h-4 text-purple-100" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleExpandRadius(activeListing)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <Radio className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expand Radius ({activeListing.currentRadiusKm}km)</span>
                    </button>

                    <button
                      onClick={() => viewPassport(activeListing)}
                      className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Passport</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
