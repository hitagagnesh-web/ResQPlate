import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building,
  HeartHandshake,
  Car,
  Shield,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RadarMap } from '../radar/RadarMap';
import { FoodListing } from '../../types';

export const RoleDashboards: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    listings,
    setSelectedListing,
    setCurrentView,
  } = useApp();

  const [volAvailable, setVolAvailable] = useState(true);
  const [volVehicle] = useState<'Car' | 'Scooter' | 'Bicycle' | 'EV Van'>('Car');

  const [ngoCapacity, setNgoCapacity] = useState(75);
  const [ngoDietary, setNgoDietary] = useState('Vegetarian');
  const [ngoMaxDistance, setNgoMaxDistance] = useState(5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* Role Navigation Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 min-w-0 flex-1">
          <span className="text-xs font-semibold text-slate-400 px-2.5 shrink-0">Active Console:</span>
          {(
            [
              { role: 'donor', label: 'Donor Facility', icon: Building },
              { role: 'ngo', label: 'NGO / Shelter', icon: HeartHandshake },
              { role: 'volunteer', label: 'Volunteer Hero', icon: Car },
              { role: 'admin', label: 'Admin Command', icon: Shield },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentRole === tab.role;
            return (
              <button
                key={tab.role}
                onClick={() => setCurrentRole(tab.role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-[#0E142E]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-mono text-purple-300 bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-500/40 font-semibold shrink-0 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>Grid Sync: Active</span>
        </div>
      </div>

      {/* 1. DONOR DASHBOARD VIEW */}
      {currentRole === 'donor' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase">Donor Facility Console</span>
              <h2 className="text-2xl font-bold text-slate-100">Urban Tiffin House</h2>
              <p className="text-xs text-slate-400">
                Linking Road, Khar West · Commercial Food Business License #MH-4019
              </p>
            </div>

            <button
              onClick={() => setCurrentView('new-listing')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all transform active:scale-98 shrink-0"
            >
              <Plus className="w-4 h-4 text-purple-100" />
              <span>List Surplus Food</span>
            </button>
          </div>

          {/* Kitchen Prevention Insight Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#170E30] to-[#0E1538] border border-purple-500/40 space-y-2 shadow-lg">
            <div className="text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Kitchen Prevention Insight</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              "You consistently experience the highest surplus volume between <strong>8:00 PM – 9:00 PM on Fridays</strong> (~42 excess servings)."
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recommended action: Consider preparing <strong>12% fewer portions</strong> next Friday to optimize gross margins and reduce carbon footprint at the source.
            </p>
          </div>

          {/* Donor Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-xs text-slate-400">Today's Surplus</div>
              <div className="text-xl font-bold text-slate-100 font-mono mt-1">85 Meals</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-xs text-slate-400">Active Listings</div>
              <div className="text-xl font-bold text-purple-300 font-mono mt-1">1 Live</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-xs text-slate-400">Completed Donations</div>
              <div className="text-xl font-bold text-blue-400 font-mono mt-1">48 Batches</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-xs text-slate-400">Rescue Success Rate</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">98.2%</div>
            </div>
          </div>

          {/* Active Listings Table */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Your Donation Listings</h3>
            <div className="space-y-3">
              {listings.slice(0, 3).map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">{l.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0E142E] text-slate-300 border border-[#222E54]">
                        {l.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {l.servings} meals · Prepared {new Date(l.preparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Safety: {l.safety.score}/100
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-300 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40">
                      {l.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedListing(l);
                        setCurrentView('live-radar');
                      }}
                      className="text-xs text-purple-300 hover:text-purple-200 font-semibold underline cursor-pointer"
                    >
                      Track Radar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. NGO / RECIPIENT DASHBOARD VIEW */}
      {currentRole === 'ngo' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono text-blue-400 font-semibold uppercase">NGO Partner Console</span>
              <h2 className="text-2xl font-bold text-slate-100">Hope Foundation Night Shelter</h2>
              <p className="text-xs text-slate-400">
                Relief Lane, Bandra Station West · Reg #NGO-88219 · Contact: Sister Mary
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400">Capacity Need:</span>
              <span className="text-sm font-bold font-mono text-purple-300 px-3 py-1 rounded-xl bg-[#0E142E] border border-[#222E54]">
                {ngoCapacity} Beds Filled
              </span>
            </div>
          </div>

          {/* Preferences Configuration Bar */}
          <div className="p-5 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Recipient Matching Preferences</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Max Proximity Radius</label>
                <select
                  value={ngoMaxDistance}
                  onChange={(e) => setNgoMaxDistance(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value={3}>Within 3 km</option>
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dietary Acceptance</label>
                <select
                  value={ngoDietary}
                  onChange={(e) => setNgoDietary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Halal">Halal & Non-Veg</option>
                  <option value="Any">All Certified Safe Food</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Headcount To Feed</label>
                <input
                  type="number"
                  value={ngoCapacity}
                  onChange={(e) => setNgoCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Available Food Ready for Claim */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100">Surplus Food Within Your Reach</h3>
              <span className="text-xs text-blue-400 font-mono font-semibold">Matched by Proximity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {listings
                .filter((l) => l.status === 'Available')
                .map((l) => (
                  <div
                    key={l.id}
                    className="p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-100 truncate">{l.title}</h4>
                        <div className="text-xs text-slate-400 truncate">{l.donorName}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-300 shrink-0">
                        {l.servings} meals
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#1E2648]">
                      <span>Safety Score: {l.safety.score}/100</span>
                      <button
                        onClick={() => {
                          setSelectedListing(l);
                          setCurrentView('matching');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs cursor-pointer shadow-xs transition-all"
                      >
                        Claim for Shelter
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. VOLUNTEER DASHBOARD VIEW */}
      {currentRole === 'volunteer' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Rahul"
                className="w-14 h-14 rounded-2xl object-cover border border-[#222E54] shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-purple-400 font-semibold uppercase">Volunteer Hero Network</span>
                <h2 className="text-xl font-bold text-slate-100">Rahul Verma</h2>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                  <span>Vehicle: {volVehicle} (MH02-BK-9182)</span>
                  <span>· Reliability: 99%</span>
                  <span>· 84 Rescues Done</span>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-medium">Availability:</span>
              <button
                onClick={() => setVolAvailable(!volAvailable)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  volAvailable
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                    : 'bg-[#0E142E] text-slate-400 border border-[#222E54]'
                }`}
              >
                {volAvailable ? 'Active & Ready' : 'Offline'}
              </button>
            </div>
          </div>

          {/* Volunteer Rescue Opportunities Near You */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100">Rescue Opportunities Near You</h3>
              <span className="text-xs text-purple-300 font-mono font-semibold">1.2 km Corridor</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                    URGENT (23m left)
                  </span>
                  <span className="text-sm font-bold text-slate-100">85 meals · Urban Tiffin House</span>
                </div>
                <div className="text-xs text-slate-400 break-words">
                  1.8 km away · Shahi Paneer, Rice & Naan · Delivery to Hope Foundation Shelter (1.2 km further)
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentView('route-optimizer');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md cursor-pointer transition-all shrink-0"
              >
                Accept Rescue & Launch Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADMIN COMMAND CENTER VIEW */}
      {currentRole === 'admin' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                System Command & Telemetry
              </span>
              <h2 className="text-2xl font-bold text-slate-100">ResQPlate Command Center</h2>
              <p className="text-xs text-slate-400">
                Autonomous dispatch routing, radar frequency monitoring, and food safety compliance.
              </p>
            </div>

            {/* Live System Status Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Prediction Engine: Online
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Matching Engine: Online
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-[#0E142E] border border-[#222E54] text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Route Optimizer: Online
              </span>
            </div>
          </div>

          {/* Command Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">Active Rescues</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">18 Active</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">At-Risk Food</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">140 Meals</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">Prediction Alerts</div>
              <div className="text-lg font-bold text-purple-300 font-mono mt-0.5">7 Hotspots</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">Volunteers On Duty</div>
              <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">18 Active</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">Success Rate</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">94.2%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md">
              <div className="text-[10px] text-slate-400 font-mono">Failed Dispatches</div>
              <div className="text-lg font-bold text-slate-300 font-mono mt-0.5">0 Today</div>
            </div>
          </div>

          {/* Live Full-Grid Radar Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-slate-200">Metropolitan Tactical Grid Map</span>
              <span className="text-purple-300 font-mono font-medium">Auto-sync 200ms</span>
            </div>
            <RadarMap mode="all" defaultView="circular" className="h-[440px]" />
          </div>

          {/* Real-Time Activity Feed Ticker */}
          <div className="p-5 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Real-Time Activity Feed</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070A18] border border-[#1E2648]">
                <span className="text-slate-200">Hope Foundation accepted 45 meals from Golden Crust.</span>
                <span className="text-slate-400 text-[10px]">12s ago</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070A18] border border-[#1E2648]">
                <span className="text-purple-300">New surplus detected at Grand Imperial Convention Hall (87% prob).</span>
                <span className="text-slate-400 text-[10px]">1m ago</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070A18] border border-[#1E2648]">
                <span className="text-blue-300">Rescue radius expanded to 5 km for Urban Tiffin House.</span>
                <span className="text-slate-400 text-[10px]">3m ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
