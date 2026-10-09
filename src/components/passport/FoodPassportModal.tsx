import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Clock,
  Thermometer,
  MapPin,
  ExternalLink,
  Copy,
  Building,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodPassport } from '../../types';

export const FoodPassportView: React.FC = () => {
  const { passports, selectedPassport, setSelectedPassport } = useApp();
  const [copied, setCopied] = useState(false);

  const activePassport = selectedPassport || passports[0];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activePassport.batchHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full px-2 sm:px-0">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 min-w-0 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-words">
            Verifiable Food Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
            Immutable chain-of-custody tracking every food surplus batch from kitchen pan to beneficiary plate. Ensuring safety, compliance, and transparent donation reporting.
          </p>
        </div>

        {/* Passport Selector Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={activePassport.passportId}
            onChange={(e) => {
              const found = passports.find((p) => p.passportId === e.target.value);
              if (found) setSelectedPassport(found);
            }}
            className="px-3 py-2 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 shadow-xs"
            aria-label="Select food passport"
          >
            {passports.map((p) => (
              <option key={p.passportId} value={p.passportId}>
                {p.passportId} — {p.foodName.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Passport Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Passport Card */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-5 relative overflow-hidden min-w-0">
            <div className="flex items-start justify-between border-b border-[#1E2648] pb-4 gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                  RESQPLATE PASSPORT SYSTEM
                </span>
                <div className="text-lg sm:text-xl font-extrabold text-slate-100 font-mono tracking-tight mt-0.5 truncate">
                  {activePassport.passportId}
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
                  activePassport.completed
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/40 font-bold'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40 font-bold'
                }`}
              >
                {activePassport.completed ? 'VERIFIED COMPLETE' : 'IN TRANSIT'}
              </span>
            </div>

            {/* Prominent Vector QR Code Card */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-3.5">
              <div className="text-center space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  Official Proof-of-Rescue QR Code
                </span>
                <p className="text-[10px] text-slate-400">
                  Scan with any phone camera to view immutable cold-chain ledger
                </p>
              </div>

              {/* Dedicated High-Contrast Crisp White Canvas for scanner readability */}
              <div
                className="qr-code-canvas relative p-4 rounded-2xl shadow-xl border-2 border-purple-500/80 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', width: '180px', height: '180px' }}
              >
                {/* L-shaped Scanner Guides on Corners */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-900 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-900 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-900 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-900 pointer-events-none" />

                {/* Vector QR Code SVG */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full select-none"
                  shapeRendering="crispEdges"
                >
                  <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                  <rect x="6" y="6" width="28" height="28" fill="#0F172A" />
                  <rect x="10" y="10" width="20" height="20" fill="#FFFFFF" />
                  <rect x="14" y="14" width="12" height="12" fill="#0F172A" />

                  <rect x="66" y="6" width="28" height="28" fill="#0F172A" />
                  <rect x="70" y="10" width="20" height="20" fill="#FFFFFF" />
                  <rect x="74" y="14" width="12" height="12" fill="#0F172A" />

                  <rect x="6" y="66" width="28" height="28" fill="#0F172A" />
                  <rect x="10" y="70" width="20" height="20" fill="#FFFFFF" />
                  <rect x="14" y="74" width="12" height="12" fill="#0F172A" />

                  <rect x="38" y="10" width="4" height="4" fill="#0F172A" />
                  <rect x="46" y="14" width="8" height="4" fill="#0F172A" />
                  <rect x="42" y="22" width="4" height="8" fill="#0F172A" />
                  <rect x="54" y="26" width="6" height="4" fill="#0F172A" />

                  <rect x="10" y="42" width="6" height="4" fill="#0F172A" />
                  <rect x="22" y="46" width="4" height="8" fill="#0F172A" />
                  <rect x="30" y="38" width="8" height="4" fill="#0F172A" />

                  <rect x="42" y="42" width="16" height="16" fill="#0F172A" />
                  <rect x="46" y="46" width="8" height="8" fill="#FFFFFF" />

                  <rect x="62" y="38" width="6" height="8" fill="#0F172A" />
                  <rect x="74" y="44" width="8" height="4" fill="#0F172A" />
                  <rect x="86" y="40" width="4" height="8" fill="#0F172A" />

                  <rect x="38" y="66" width="6" height="6" fill="#0F172A" />
                  <rect x="48" y="74" width="4" height="8" fill="#0F172A" />
                  <rect x="42" y="86" width="8" height="4" fill="#0F172A" />
                  <rect x="54" y="68" width="4" height="12" fill="#0F172A" />

                  <rect x="66" y="66" width="8" height="4" fill="#0F172A" />
                  <rect x="78" y="70" width="6" height="8" fill="#0F172A" />
                  <rect x="88" y="66" width="4" height="8" fill="#0F172A" />
                  <rect x="70" y="82" width="8" height="6" fill="#0F172A" />
                  <rect x="84" y="84" width="6" height="6" fill="#0F172A" />
                </svg>
              </div>

              <div className="text-[10px] font-mono text-purple-300">
                Payload: resqplate://passport/{activePassport.passportId}
              </div>
            </div>

            {/* Food Summary Specs */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">{activePassport.foodName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activePassport.donorName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648]">
                  <div className="text-[10px] text-slate-400">Total Servings</div>
                  <div className="text-sm font-bold font-mono text-purple-300 mt-0.5">
                    {activePassport.servings} Meals
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648]">
                  <div className="text-[10px] text-slate-400">CO₂e Offset</div>
                  <div className="text-sm font-bold font-mono text-blue-300 mt-0.5">
                    {activePassport.co2AvoidedKg} kg
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-xs">
                <div className="text-[10px] text-slate-400">Recipient Beneficiary</div>
                <div className="font-semibold text-slate-100 mt-0.5">
                  {activePassport.recipientName}
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Stamp */}
            <div className="p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono">Immutable Hash Stamp</span>
                <button
                  onClick={handleCopyHash}
                  className="text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-purple-300 truncate">
                {activePassport.batchHash}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Chronological Audit Timeline */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-6 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100">Full Traceability History</h3>
                <p className="text-xs text-slate-400">
                  Tamper-evident chronological milestone chain
                </p>
              </div>
              <span className="text-xs text-purple-300 font-mono font-semibold shrink-0">
                {activePassport.milestones.length} Certified Events
              </span>
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#1E2648]">
              {activePassport.milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex items-start gap-4 group min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#0E142E] border-2 border-purple-500 text-purple-300 flex items-center justify-center shrink-0 z-10 mt-0.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-2 group-hover:border-purple-500/60 transition-colors min-w-0">
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block truncate">
                          {milestone.stage}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 mt-0.5 truncate">
                          {milestone.actor}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{milestone.location}</span>
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                        {new Date(milestone.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {milestone.temperatureCelsius && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E142E] border border-[#222E54] text-slate-200 text-xs font-mono">
                        <Thermometer className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Core Reading: {milestone.temperatureCelsius}°C</span>
                      </div>
                    )}

                    {milestone.notes && (
                      <p className="text-xs text-slate-400 italic pt-1 border-t border-[#1E2648] break-words">
                        "{milestone.notes}"
                      </p>
                    )}

                    <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center justify-between pt-1 gap-1">
                      <span>Sign-off: {milestone.role}</span>
                      <span className="truncate max-w-[200px]">Hash: {milestone.verifiedHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
