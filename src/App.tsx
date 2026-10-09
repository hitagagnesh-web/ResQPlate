import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { FutureFoodRadar } from './components/radar/FutureFoodRadar';
import { LiveRescueRadar } from './components/radar/LiveRescueRadar';
import { AIFoodListingView } from './components/listing/AIFoodListingModal';
import { SmartMatchingView } from './components/matching/SmartMatchingView';
import { RouteOptimizerView } from './components/routes/RouteOptimizerView';
import { FoodPassportView } from './components/passport/FoodPassportModal';
import { ImpactDashboard } from './components/impact/ImpactDashboard';
import { RoleDashboards } from './components/dashboards/RoleDashboards';
import { ShieldCheck, Sprout, Compass } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-purple-200 selection:text-purple-900 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Workspace Layout with Sidebar + Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {currentView === 'landing' && <LandingPage />}
              {currentView === 'live-radar' && <LiveRescueRadar />}
              {currentView === 'future-radar' && <FutureFoodRadar />}
              {currentView === 'new-listing' && <AIFoodListingView />}
              {currentView === 'matching' && <SmartMatchingView />}
              {currentView === 'route-optimizer' && <RouteOptimizerView />}
              {currentView === 'food-passport' && <FoodPassportView />}
              {currentView === 'impact' && <ImpactDashboard />}
              {currentView === 'dashboard' && <RoleDashboards />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sub-Footer */}
      <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-md py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">ResQPlate Network</span>
            <span>·</span>
            <span>Predictive Food Surplus Interception & Cold Chain Traceability</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HACCP Decision Support
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Sprout className="w-3.5 h-3.5" /> Zero Food Waste Protocol
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
