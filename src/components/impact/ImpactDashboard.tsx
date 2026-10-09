import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Scale,
  CloudRain,
  Award,
  Users,
  Building,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  strokeColor = '#A855F7',
  bgColor = '#1E2648',
  label,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <span className="text-base sm:text-lg font-bold font-mono text-slate-100">{label}</span>}
        {sublabel && <span className="text-[10px] text-slate-400 font-medium leading-none">{sublabel}</span>}
      </div>
    </div>
  );
};

export const ImpactDashboard: React.FC = () => {
  const { impactStats, badges } = useApp();
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week' | 'today'>('all');

  const mealsCount = timeframe === 'today' ? 124 : timeframe === 'week' ? 840 : timeframe === 'month' ? 3420 : impactStats.mealsRescued;
  const co2Kg = timeframe === 'today' ? 248 : timeframe === 'week' ? 1680 : timeframe === 'month' ? 6840 : impactStats.co2AvoidedKg;
  const wasteKg = timeframe === 'today' ? 160 : timeframe === 'week' ? 1120 : timeframe === 'month' ? 4560 : impactStats.foodSavedKg;
  const activeDonors = timeframe === 'today' ? 8 : timeframe === 'week' ? 22 : 48;

  const monthlyData = [
    { month: 'Oct', meals: 1240 },
    { month: 'Nov', meals: 1850 },
    { month: 'Dec', meals: 2420 },
    { month: 'Jan', meals: 2980 },
    { month: 'Feb', meals: 3420 },
    { month: 'Mar', meals: 4120 },
  ];

  const LEADERBOARD_USERS = [
    { rank: 1, name: 'Rahul Verma', role: 'Volunteer Courier', score: '84 Rescues', points: '2,420' },
    { rank: 2, name: 'Grand Imperial Hall', role: 'Donor Partner', score: '1,240 Meals', points: '1,980' },
    { rank: 3, name: 'Ananya Sharma', role: 'Volunteer Courier', score: '62 Rescues', points: '1,740' },
    { rank: 4, name: 'Urban Tiffin House', role: 'Donor Partner', score: '850 Meals', points: '1,420' },
    { rank: 5, name: 'Hope Foundation', role: 'Recipient Partner', score: '98 Batches', points: '1,280' },
  ];

  const categoryDistribution = [
    { label: 'Prepared Meals & Curries', percentage: 48, color: 'bg-purple-500' },
    { label: 'Buffet Surplus & Banquets', percentage: 26, color: 'bg-blue-500' },
    { label: 'Bakery & Artisan Bread', percentage: 14, color: 'bg-indigo-500' },
    { label: 'Fresh Salads & Produce', percentage: 12, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 min-w-0 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight break-words">
            Impact & Waste Prevention Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">
            Verified audit of redirected calories, carbon emissions avoided, and community meals served across the metropolitan rescue grid.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center bg-[#070A18] p-1.5 rounded-2xl border border-[#1E2648] shadow-xs self-start md:self-auto shrink-0">
          {(
            [
              { id: 'all', label: 'All-Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'This Week' },
              { id: 'today', label: 'Today' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                timeframe === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Impact Metrics with Animated Upward Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Meals Rescued */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md text-left min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-950/80 text-purple-300 flex items-center justify-center mb-2 border border-purple-500/40">
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono truncate">
            <AnimatedCounter key={`meals-${timeframe}`} value={mealsCount} duration={1200} />
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">Meals Rescued</div>
          <div className="text-[10px] text-purple-300 font-mono mt-1 font-semibold truncate">+14% vs baseline</div>
        </motion.div>

        {/* Food Waste Prevented (kg) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md text-left min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-950/80 text-blue-300 flex items-center justify-center mb-2 border border-blue-500/40">
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono truncate">
            <AnimatedCounter key={`waste-${timeframe}`} value={wasteKg} duration={1200} suffix=" kg" />
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">Food Diverted</div>
          <div className="text-[10px] text-blue-300 font-mono mt-1 font-semibold truncate">Calibrated weight</div>
        </motion.div>

        {/* CO2 Emissions Saved (kg) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md text-left min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-300 flex items-center justify-center mb-2 border border-indigo-500/40">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono truncate">
            <AnimatedCounter key={`co2-${timeframe}`} value={co2Kg} duration={1200} suffix=" kg" />
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">CO₂e Avoided</div>
          <div className="text-[10px] text-indigo-300 font-mono mt-1 font-semibold truncate">Certified reductions</div>
        </motion.div>

        {/* Active Donors */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -2 }}
          className="p-4 rounded-2xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-md text-left min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-950/80 text-purple-300 flex items-center justify-center mb-2 border border-purple-500/40">
            <Building className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono truncate">
            <AnimatedCounter key={`donors-${timeframe}`} value={activeDonors} duration={1000} />
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">Active Food Donors</div>
          <div className="text-[10px] text-purple-300 font-mono mt-1 font-semibold truncate">Hotels, caterers & cafes</div>
        </motion.div>
      </div>

      {/* 3. Circular Progress Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gauge 1: Rescue Success Rate */}
        <div className="p-5 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold">
              Efficiency Gauge
            </span>
            <h3 className="text-base font-bold text-slate-100 truncate">Rescue Success Rate</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed break-words">
              Percentage of listed surpluses matched and picked up before safe consumption window expires.
            </p>
            <div className="text-[11px] font-mono text-purple-300 font-semibold pt-1">
              Top 5% among municipal rescue platforms
            </div>
          </div>

          <div className="shrink-0 p-2">
            <CircularProgress
              percentage={impactStats.rescueSuccessRate}
              size={110}
              strokeWidth={9}
              strokeColor="#A855F7"
              bgColor="#1E2648"
              label={`${impactStats.rescueSuccessRate}%`}
              sublabel="Fulfilled"
            />
          </div>
        </div>

        {/* Gauge 2: Zero Waste Interception Rate */}
        <div className="p-5 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
              Ecological Target
            </span>
            <h3 className="text-base font-bold text-slate-100 truncate">Landfill Diversion Target</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed break-words">
              Commercial hospitality surplus diverted toward community kitchens instead of incinerators.
            </p>
            <div className="text-[11px] font-mono text-blue-300 font-semibold pt-1">
              Avoided <AnimatedCounter value={co2Kg} suffix=" kg" duration={1200} /> CO₂e
            </div>
          </div>

          <div className="shrink-0 p-2">
            <CircularProgress
              percentage={88}
              size={110}
              strokeWidth={9}
              strokeColor="#38BDF8"
              bgColor="#1E2648"
              label="88%"
              sublabel="Diverted"
            />
          </div>
        </div>
      </div>

      {/* 4. Charts & Categorical Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Trend Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Monthly Rescue Acceleration</h3>
              <p className="text-[11px] text-slate-400">Nutritional servings diverted per month</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40 font-bold shrink-0">
              +232% H2 Growth
            </span>
          </div>

          {/* Animated Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#1E2648]">
            {monthlyData.map((d, i) => {
              const maxMeals = 4500;
              const heightPercent = (d.meals / maxMeals) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group min-w-0">
                  <div className="text-[10px] font-mono text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    {d.meals}
                  </div>
                  <div className="w-full bg-[#070A18] border border-[#1E2648] rounded-xl h-36 flex items-end p-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-lg group-hover:from-purple-500 group-hover:to-blue-400 transition-colors"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 gap-2">
            <span>Average Pickup Time: <strong className="text-purple-300 font-mono">19.4 mins</strong></span>
            <span>Food Expiry Interception: <strong className="text-blue-400 font-mono">98.1%</strong></span>
          </div>
        </div>

        {/* Right Col: Category Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Food Category Distribution</h3>
            <p className="text-[11px] text-slate-400">Ratio of rescued culinary types</p>
          </div>

          <div className="space-y-3 pt-2">
            {categoryDistribution.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat.label}</span>
                  <span className="font-mono text-purple-300 font-bold">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#070A18] border border-[#1E2648] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.9, delay: idx * 0.12 }}
                    className={`h-full ${cat.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070A18] border border-[#1E2648] text-xs mt-4">
            <span className="font-semibold text-purple-300">Predictive Waste Reduction Trend:</span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Recurring corporate donors report a <strong>16% decrease in over-preparation</strong> after utilizing our Future Surplus analytics recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Gamification, Badges & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Achievement Badges */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Community Hero Badges</span>
            </h3>
            <span className="text-xs text-purple-300 font-mono font-semibold shrink-0">
              {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all min-w-0 ${
                  b.unlocked
                    ? 'bg-[#101738] border-purple-500/60 text-slate-100'
                    : 'bg-[#070A18] border-[#1E2648] text-slate-500 opacity-60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#0E142E] border border-[#222E54] flex items-center justify-center mb-2 shadow-xs">
                  <Award className={`w-4 h-4 ${b.unlocked ? 'text-purple-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-bold truncate">{b.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {b.description}
                </div>
                <div className="mt-2 text-[10px] font-mono text-purple-300 font-semibold">
                  {b.unlocked ? 'Completed' : `${b.progressPercent}% in progress`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Leaderboard */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Rescue Grid Leaderboard</span>
            </h3>
            <span className="text-xs text-slate-400">Top Rescuers & Partners</span>
          </div>

          <div className="space-y-2.5">
            {LEADERBOARD_USERS.map((user) => (
              <div
                key={user.rank}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#070A18] border border-[#1E2648] text-xs min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-bold text-purple-400 w-4 shrink-0">#{user.rank}</span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-100 truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-100">{user.score}</div>
                  <div className="text-[10px] text-purple-300 font-mono">{user.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="p-3 bg-[#070A18] rounded-2xl border border-[#1E2648] text-center text-[11px] text-slate-400">
        Data audited against standard IPCC carbon conversion factors (1.85 kg CO₂e / kg food waste prevented). Sample testbed figures provided for demonstration.
      </div>
    </div>
  );
};
