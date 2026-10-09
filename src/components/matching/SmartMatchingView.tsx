import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Award,
  ArrowRight,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSmartMatches } from '../../services/aiService';

export const SmartMatchingView: React.FC = () => {
  const {
    listings,
    selectedListing,
    ngos,
    claimRescue,
    assignVolunteer,
    setCurrentView,
  } = useApp();

  const activeListing = selectedListing || listings[0];
  const matches = calculateSmartMatches(activeListing, ngos);
  const bestMatch = matches[0];
  const alternativeMatches = matches.slice(1);

  const [selectedMatchNgoId, setSelectedMatchNgoId] = useState<string>(bestMatch?.ngoId || 'ngo-1');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  const currentMatch = matches.find((m) => m.ngoId === selectedMatchNgoId) || bestMatch;
  const currentNgo = ngos.find((n) => n.id === currentMatch.ngoId);

  const handleConfirmMatch = () => {
    setIsAssigning(true);
    claimRescue(activeListing.id, currentMatch.ngoId);
    assignVolunteer(activeListing.id, 'vol-1');

    setTimeout(() => {
      setIsAssigning(false);
      setCurrentView('route-optimizer');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full px-2 sm:px-0">
      {/* Top Banner in Black, Purple, Blue */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 min-w-0 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-words">
            Smart Surplus Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
            Matching surplus food with the highest-impact recipient based on proximity, consumption capacity, dietary constraints, and rapid fulfillment ETA.
          </p>
        </div>

        {/* Selected Food Card */}
        <div className="p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] text-left md:text-right shadow-xs min-w-0">
          <div className="text-[11px] text-slate-400 font-medium">Matching Surplus For:</div>
          <div className="text-sm font-bold text-slate-100 truncate max-w-xs mt-0.5">
            {activeListing.title}
          </div>
          <div className="text-[11px] text-purple-300 font-mono mt-0.5 truncate">
            {activeListing.servings} meals · {activeListing.donorName}
          </div>
        </div>
      </div>

      {/* Main Grid: Best Match Hero Card + Why this match breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Star Match Card */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-5 relative overflow-hidden min-w-0">
            {/* Match percentage highlight */}
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-500/40">
                  <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Optimal Match Found</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 break-words">
                  {currentMatch.ngoName}
                </h2>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 break-words">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{currentNgo?.location.address}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono tracking-tight">
                  {currentMatch.overallScore}%
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Compatibility Score
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] text-center min-w-0">
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 truncate">Distance</div>
                <div className="text-sm font-bold text-slate-100 font-mono mt-0.5 truncate">
                  {currentMatch.distanceKm} km away
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 truncate">Recipient Needs</div>
                <div className="text-sm font-bold text-purple-300 font-mono mt-0.5 truncate">
                  {currentMatch.canServeCount} People
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400 truncate">Est. Transit Time</div>
                <div className="text-sm font-bold text-blue-400 font-mono mt-0.5 truncate">
                  ~{currentMatch.etaMinutes} mins
                </div>
              </div>
            </div>

            {/* Detailed Weight Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Matching Algorithm Criteria:
              </div>

              <div className="space-y-2">
                {[
                  { factor: 'Proximity Distance (40%)', score: currentMatch.breakdown.distanceFactor, detail: 'Recipient within optimal rapid transit radius' },
                  { factor: 'Requirement Fit (25%)', score: currentMatch.breakdown.requirementFit, detail: 'Sufficient bed and meal capacity to absorb batch' },
                  { factor: 'Pickup Availability (15%)', score: currentMatch.breakdown.pickupAvailability, detail: 'Recipient staff active to accept incoming handover' },
                  { factor: 'Urgency Priority (10%)', score: currentMatch.breakdown.urgencyPriority, detail: 'Critical dietary need prioritization' },
                  { factor: 'Reliability Rating (10%)', score: currentMatch.breakdown.reliabilityRating, detail: 'Verified past delivery receipt rate' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.factor}</span>
                      <span className="font-mono text-purple-300 font-bold">{item.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141C3C] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="p-4 rounded-2xl bg-[#070A18] border border-purple-500/40 text-xs space-y-1">
              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Recommendation Reason:</span>
              </span>
              <p className="text-slate-300 leading-relaxed italic">
                "{currentMatch.reasoning}"
              </p>
            </div>

            {/* Action Confirmation Button */}
            <button
              onClick={handleConfirmMatch}
              disabled={isAssigning}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
            >
              {isAssigning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Optimized Dispatch Route...</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-4 h-4 text-purple-100" />
                  <span>Confirm Match & Assign Volunteer Courier</span>
                  <ArrowRight className="w-4 h-4 text-purple-100" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Alternative Matches */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate">Alternative Recipient Matches</h3>
              <span className="text-xs text-slate-400 shrink-0">Select to override</span>
            </div>

            <div className="space-y-3">
              {alternativeMatches.map((alt) => {
                const ngo = ngos.find((n) => n.id === alt.ngoId);
                const isSelected = selectedMatchNgoId === alt.ngoId;

                return (
                  <div
                    key={alt.ngoId}
                    onClick={() => setSelectedMatchNgoId(alt.ngoId)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all min-w-0 ${
                      isSelected
                        ? 'bg-[#101738] border-purple-500 ring-1 ring-purple-500 text-slate-100 shadow-md'
                        : 'bg-[#070A18] border-[#1E2648] hover:border-purple-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-100 truncate">
                          {alt.ngoName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {ngo?.type} · Cap: {alt.canServeCount}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-bold font-mono text-purple-300">
                          {alt.overallScore}%
                        </span>
                        <div className="text-[10px] text-slate-400">{alt.distanceKm} km</div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1E2648] flex items-center justify-between text-[11px] text-slate-400">
                      <span>ETA: {alt.etaMinutes} mins</span>
                      <span className="text-purple-300 font-medium">
                        {isSelected ? '✓ Selected' : 'Click to select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
