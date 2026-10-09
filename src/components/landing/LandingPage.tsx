import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Heart,
  Leaf,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  ArrowDown,
  Clock,
  ChevronRight,
  AlertTriangle,
  Zap,
  TrendingUp,
  Award,
  Radio,
  Sliders,
  Soup,
  Salad,
  Croissant,
  Apple,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EarthyAnimatedBackground } from '../common/EarthyAnimatedBackground';
import { OverviewHeroRadarSweep } from '../radar/OverviewHeroRadarSweep';

// Smooth Animated Counter Hook/Component
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string; prefix?: string }> = ({
  value,
  duration = 1200,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const stepTime = Math.max(16, Math.floor(duration / 60));
    const increment = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const heroCardRef = useRef<HTMLDivElement>(null);
  const [heroTilt, setHeroTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });

  // Surplus estimator state
  const [estimatorGuests, setEstimatorGuests] = useState<number>(450);

  // 3D Tilt on hero card
  const handleHeroCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setHeroTilt({ rotateX, rotateY });
  };

  const handleHeroCardMouseLeave = () => {
    setHeroTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleStartRescuing = () => {
    setCurrentView('new-listing');
  };

  const handleExploreLiveRadar = () => {
    setCurrentView('live-radar');
  };

  const handleExploreFutureRadar = () => {
    setCurrentView('future-radar');
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Estimated surplus meals calculated from guest count
  const estimatedSurplus = Math.round(estimatorGuests * 0.18);
  const estimatedCO2 = (estimatedSurplus * 0.42).toFixed(1);

  return (
    <div className="space-y-12 pb-16 w-full max-w-7xl mx-auto px-2 sm:px-0">
      {/* 1. HERO SECTION - WHITE AND PASTEL THEME */}
      <EarthyAnimatedBackground variant="hero" interactive={true} className="rounded-3xl border border-slate-200/80 shadow-sm bg-white">
        <section className="relative p-5 sm:p-8 lg:p-12 overflow-hidden">
          {/* Subtle Decorative Food Elements */}
          <div className="absolute top-6 right-10 text-amber-300/70 animate-float-gentle pointer-events-none hidden md:block">
            <Soup className="w-10 h-10" />
          </div>
          <div className="absolute bottom-10 left-8 text-emerald-300/70 animate-float-reverse pointer-events-none hidden md:block">
            <Salad className="w-10 h-10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Headline, Descriptions & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-5 min-w-0"
            >
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] break-words">
                Rescue surplus food <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600">before</span> it becomes waste.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl break-words">
                Connecting banquet halls, restaurants, and bakeries with local NGOs and volunteer dispatchers. Our circular radar forecasts surplus hours in advance to keep nutritious meals in the human food cycle.
              </p>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExploreLiveRadar}
                  className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white font-semibold text-xs shadow-md shadow-purple-200 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Compass className="w-4 h-4 text-purple-100" />
                  <span>Find Nearby Food</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-100" />
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartRescuing}
                  className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-purple-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <UtensilsCrossed className="w-4 h-4 text-purple-600" />
                  <span>Donate Surplus Food</span>
                </motion.button>

                <button
                  onClick={scrollToHowItWorks}
                  className="py-3 px-3 rounded-2xl text-slate-500 hover:text-purple-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Protocol Details</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Live Statistics Grid in White and Pastel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100">
                {/* Stat 1 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="text-lg sm:text-xl font-extrabold text-purple-700 font-mono leading-none">
                    <AnimatedCounter value={124} duration={1200} />
                  </div>
                  <div className="text-xs sm:text-[11px] font-medium text-slate-600 mt-1.5 leading-snug whitespace-normal break-words">
                    Meals rescued
                  </div>
                </motion.div>

                {/* Stat 2 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="text-lg sm:text-xl font-extrabold text-sky-700 font-mono leading-none">
                    <AnimatedCounter value={18} duration={1000} />
                  </div>
                  <div className="text-xs sm:text-[11px] font-medium text-slate-600 mt-1.5 leading-snug whitespace-normal break-words">
                    Active rescues
                  </div>
                </motion.div>

                {/* Stat 3 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="text-lg sm:text-xl font-extrabold text-indigo-700 font-mono leading-none">
                    <AnimatedCounter value={7240} duration={1500} suffix=" kg" />
                  </div>
                  <div className="text-xs sm:text-[11px] font-medium text-slate-600 mt-1.5 leading-snug whitespace-normal break-words">
                    Food diverted
                  </div>
                </motion.div>

                {/* Stat 4 */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100 shadow-2xs flex flex-col justify-between"
                >
                  <div className="text-lg sm:text-xl font-extrabold text-amber-700 font-mono leading-none">
                    <AnimatedCounter value={94} duration={1300} suffix="%" />
                  </div>
                  <div className="text-xs sm:text-[11px] font-medium text-slate-600 mt-1.5 leading-snug whitespace-normal break-words">
                    Success rate
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Hero Radar Sweep (Clean White Card Wrapper) */}
            <motion.div
              ref={heroCardRef}
              onMouseMove={handleHeroCardMouseMove}
              onMouseLeave={handleHeroCardMouseLeave}
              style={{
                perspective: 1000,
                rotateX: heroTilt.rotateX,
                rotateY: heroTilt.rotateY,
                transition: 'transform 0.12s ease-out',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-6 relative w-full min-w-0"
            >
              <div className="relative rounded-3xl p-1 bg-white border border-slate-200 shadow-xl overflow-hidden">
                <OverviewHeroRadarSweep className="h-[440px] sm:h-[470px]" />
              </div>
            </motion.div>
          </div>
        </section>
      </EarthyAnimatedBackground>

      {/* 2. INTERACTIVE SURPLUS ESTIMATOR SLIDER - WHITE AND PASTEL THEME */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              <span>Simulate Surplus Generation by Event Scale</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Adjust guest count to model commercial over-preparation buffers and early intercept capacity.
            </p>
          </div>
          <div className="text-xs text-purple-700 font-mono bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 font-semibold">
            HACCP Margin: 18% Buffer
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">Banquet Guest Count:</span>
              <span className="text-lg font-bold font-mono text-purple-700 bg-purple-50 px-3 py-0.5 rounded-xl border border-purple-200">
                {estimatorGuests} attendees
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={estimatorGuests}
              onChange={(e) => setEstimatorGuests(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
              aria-label="Banquet attendee slider"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>50 (Intimate Dinner)</span>
              <span>750 (Corporate Summit)</span>
              <span>1500 (Mega Gala)</span>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="text-[10px] text-purple-700 font-mono uppercase font-bold">Predicted Surplus</div>
              <div className="text-2xl font-extrabold text-purple-900 font-mono mt-0.5">
                {estimatedSurplus} meals
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Ready for early dispatch</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <div className="text-[10px] text-sky-700 font-mono uppercase font-bold">CO₂e Diverted</div>
              <div className="text-2xl font-extrabold text-sky-900 font-mono mt-0.5">
                {estimatedCO2} kg
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Methane reduction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW RESQPLATE WORKS - 5 STAGES IN CLEAN WHITE & PASTEL THEME */}
      <section id="how-it-works-section" className="space-y-6 pt-2">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How Food Rescue Radar Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A continuous loop from ML surplus forecasting to verified consumption at community kitchens.
          </p>
        </div>

        {/* Five Stage Cards with White & Pastel Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              num: '01',
              title: 'Predict',
              badge: 'bg-purple-50 text-purple-700 border-purple-200',
              icon: Sparkles,
              iconColor: 'text-purple-600',
              desc: 'ML models analyze catering scale, attendance variance, and prep margins to flag surplus 2–4 hours ahead.',
            },
            {
              num: '02',
              title: 'Detect',
              badge: 'bg-sky-50 text-sky-700 border-sky-200',
              icon: ShieldCheck,
              iconColor: 'text-sky-600',
              desc: 'Thermal tracking and AI vision evaluate safe temperatures (>60°C or <4°C) and hygiene thresholds.',
            },
            {
              num: '03',
              title: 'Match',
              badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              icon: HeartHandshake,
              iconColor: 'text-indigo-600',
              desc: 'Proximity (40%), shelter capacity, and dietary preferences pair surplus with nearby beneficiaries instantly.',
            },
            {
              num: '04',
              title: 'Rescue',
              badge: 'bg-rose-50 text-rose-700 border-rose-200',
              icon: Compass,
              iconColor: 'text-rose-600',
              desc: 'Dynamic multi-stop dispatch routes consolidate volunteer pickups, reducing cold-chain latency and emissions.',
            },
            {
              num: '05',
              title: 'Measure',
              badge: 'bg-amber-50 text-amber-700 border-amber-200',
              icon: Leaf,
              iconColor: 'text-amber-600',
              desc: 'Digital Food Passports log tamper-evident custody, temperature verification, and certified CO₂e savings.',
            },
          ].map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 space-y-2.5 text-left shadow-xs transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${step.badge}`}>
                    {step.num}
                  </span>
                  <Icon className={`w-4 h-4 ${step.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. PREDICTIVE SURPLUS HIGHLIGHT CARD (WHITE & PASTEL THEME) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-sky-50 border border-purple-200 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              “Don't wait for food waste to happen. Predict it before it happens.”
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard food charities only react after kitchens close at midnight — often too late to organize cold-chain transit. ResQPlate calculates surplus probability curves in advance, alerting drivers and night shelters so meals are claimed while fresh and piping hot.
            </p>

            <div className="pt-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExploreFutureRadar}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-purple-200 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Launch Future Food Radar</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-100" />
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-purple-200 space-y-2.5 font-mono text-xs shadow-sm">
            <div className="text-slate-500 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>Surplus Prediction Forecast</span>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            </div>
            <div className="flex items-center justify-between text-slate-900 font-bold">
              <span className="truncate max-w-[200px]">Grand Imperial Convention</span>
              <span className="text-purple-700 font-bold">87% Prob</span>
            </div>
            <div className="text-purple-600 font-semibold">Est. 120–160 meals (Buffet surplus)</div>
            <div className="text-slate-500">Expected Window: 8:30 PM – 9:15 PM</div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic font-sans">
              "Dual hot buffet setups require 22% over-preparation margin during gala speeches."
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
