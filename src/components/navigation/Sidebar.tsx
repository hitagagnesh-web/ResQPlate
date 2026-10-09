import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Compass,
  PlusCircle,
  HeartHandshake,
  Navigation,
  ShieldCheck,
  BarChart3,
  Building,
  Home,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  Zap,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { currentView, setCurrentView, listings } = useApp();
  
  const [isCapabilitiesExpanded, setIsCapabilitiesExpanded] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'radar' | 'ops' | 'impact'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navItems: {
    view: AppView;
    label: string;
    icon: any;
    category: 'radar' | 'ops' | 'impact';
    badge?: string;
    badgeColor?: string;
    desc: string;
  }[] = [
    {
      view: 'landing',
      label: 'Overview',
      icon: Home,
      category: 'radar',
      desc: 'Platform summary & autonomous loop',
    },
    {
      view: 'live-radar',
      label: 'Live Rescue Radar',
      icon: Compass,
      category: 'radar',
      badge: `${listings.filter((l) => l.status === 'Available').length} live`,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      desc: 'Real-time 360° surplus detection',
    },
    {
      view: 'future-radar',
      label: 'Future Food Radar',
      icon: Sparkles,
      category: 'radar',
      badge: 'ML Active',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Predictive deficit & surplus models',
    },
    {
      view: 'new-listing',
      label: 'AI Surplus Listing',
      icon: PlusCircle,
      category: 'ops',
      desc: 'HACCP camera analysis & publishing',
    },
    {
      view: 'matching',
      label: 'Smart Food Matching',
      icon: HeartHandshake,
      category: 'ops',
      desc: 'Weighted proximity & diet pairing',
    },
    {
      view: 'route-optimizer',
      label: 'Rescue Route Optimizer',
      icon: Navigation,
      category: 'ops',
      desc: 'Multi-stop volunteer pickup route',
    },
    {
      view: 'food-passport',
      label: 'Verifiable Food Passport',
      icon: ShieldCheck,
      category: 'impact',
      desc: 'Immutable QR cold-chain proof',
    },
    {
      view: 'impact',
      label: 'Impact Analytics',
      icon: BarChart3,
      category: 'impact',
      desc: 'CO₂e savings & meal ledger',
    },
    {
      view: 'dashboard',
      label: 'Role Console',
      icon: Building,
      category: 'impact',
      desc: 'Donor, NGO, volunteer consoles',
    },
  ];

  const handleSelect = (view: AppView) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const filteredItems = navItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeItem = navItems.find((item) => item.view === currentView) || navItems[0];
  const ActiveIcon = activeItem.icon;

  const content = (
    <div className="flex flex-col h-full justify-between p-3.5 space-y-4">
      <div className="space-y-3">
        {/* Quick Active View Status Banner */}
        <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ActiveIcon className="w-3.5 h-3.5 text-purple-100" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-mono leading-none">ACTIVE TOOL</div>
              <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{activeItem.label}</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shrink-0" />
        </div>

        {/* INTERACTIVE PLATFORM CAPABILITIES TOGGLE BUTTON */}
        <div className="space-y-2">
          <button
            onClick={() => setIsCapabilitiesExpanded(!isCapabilitiesExpanded)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-sky-50 border border-purple-200/80 hover:border-purple-300 text-slate-800 shadow-xs transition-all cursor-pointer group"
            aria-expanded={isCapabilitiesExpanded}
            aria-label="Toggle Platform Capabilities navigation menu"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs group-hover:scale-105 transition-transform">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Platform Capabilities</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 border border-purple-200 font-bold">
                    {navItems.length}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {isCapabilitiesExpanded ? 'Click to collapse & save space' : 'Click to open modules'}
                </div>
              </div>
            </div>

            <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 group-hover:text-purple-600 transition-colors">
              {isCapabilitiesExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {/* Interactive Capabilities Body (Animated Expand / Collapse) */}
          <AnimatePresence>
            {isCapabilitiesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden space-y-2 pt-1"
              >
                {/* Category Pills (Filter Tabs) */}
                <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 text-[10px] font-medium">
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'radar', label: 'Radar' },
                      { id: 'ops', label: 'Ops' },
                      { id: 'impact', label: 'Impact' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-1 py-1 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-white text-purple-900 shadow-xs font-bold border border-purple-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Navigation Items List */}
                <div className="space-y-1 max-h-[calc(100vh-22rem)] overflow-y-auto pr-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.view;

                    return (
                      <button
                        key={item.view}
                        onClick={() => handleSelect(item.view)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-50 to-indigo-50/80 text-purple-900 border border-purple-200 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? 'text-purple-600'
                                : 'text-slate-400 group-hover:text-purple-600'
                            }`}
                          />
                          <div className="text-left min-w-0">
                            <span className="truncate block font-semibold">{item.label}</span>
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                              isActive
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* When collapsed: Quick Horizontal/Mini Icon Launch Bar */}
          {!isCapabilitiesExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200"
            >
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleSelect(item.view)}
                    title={item.label}
                    className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Live System Telemetry Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-sky-50/60 border border-slate-200/80 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-purple-700 flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            <span>RADAR NODE #402</span>
          </span>
          <span className="text-[10px] text-sky-600 font-mono font-bold">ONLINE</span>
        </div>
        <div className="text-xs font-bold text-slate-800">Metropolitan Grid</div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Surplus interception active across 140 kitchens.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200/80 bg-white/95 backdrop-blur-xl min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-slate-200 p-4 shadow-2xl flex flex-col h-full text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer border border-slate-200"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-2">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
