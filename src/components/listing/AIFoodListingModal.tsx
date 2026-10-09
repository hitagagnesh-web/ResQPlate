import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Utensils,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Boxes,
  RefreshCw,
  Info,
  Compass,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodListing } from '../../types';

const FOOD_SAMPLE_PRESETS = [
  {
    title: '50 Servings Vegetable Biryani & Raita',
    category: 'Cooked Meals',
    servings: 50,
    weightKg: 25,
    temp: 68,
    storage: 'Insulated Cambro Pan (>65°C)',
    pkg: 'Commercial Food-Grade Containers',
    diet: 'Vegetarian',
    allergens: 'Dairy (Raita curd)',
    venue: 'Grand Imperial Convention Hall',
    donor: 'Chef Anand Banquet Services',
    address: 'Bandra-Kurla Complex, Sector 4',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: '35 Gourmet Croissants & Sourdough Loaves',
    category: 'Bakery',
    servings: 35,
    weightKg: 12,
    temp: 22,
    storage: 'Ambient Dry Bakery Crates (18–24°C)',
    pkg: 'Wax-Lined Breathable Bakery Bags',
    diet: 'Vegetarian',
    allergens: 'Gluten, Wheat',
    venue: 'Bake & Craft Gourmet Patisserie',
    donor: 'Bake & Craft Kitchen',
    address: 'Pali Hill, Bandra West',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: '40 Portions Paneer Butter Masala & Naan',
    category: 'Cooked Meals',
    servings: 40,
    weightKg: 20,
    temp: 72,
    storage: 'Insulated Thermal Chafing Trays (>65°C)',
    pkg: 'Sealed Stainless Steel Thermal Tins',
    diet: 'Vegetarian',
    allergens: 'Dairy, Cashew paste',
    venue: 'Urban Tiffin House',
    donor: 'Urban Tiffin Kitchens',
    address: 'Linking Road, Khar West',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: '60 Mixed Grain Bowls & Fresh Mediterranean Salad',
    category: 'Fresh Produce',
    servings: 60,
    weightKg: 18,
    temp: 3,
    storage: 'Refrigerated Cold Box (<4°C)',
    pkg: 'Recyclable Lidded Deli Bowls',
    diet: 'Vegan',
    allergens: 'Sesame (Tahini dressing)',
    venue: 'Green Harbor Organic Bistro',
    donor: 'Green Harbor Kitchen',
    address: 'North Avenue, Santacruz West',
    city: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
  },
];

export const AIFoodListingView: React.FC = () => {
  const { createListing, setSelectedListing, setCurrentView, triggerConfetti } = useApp();

  const [title, setTitle] = useState(FOOD_SAMPLE_PRESETS[0].title);
  const [category, setCategory] = useState<FoodListing['category']>('Prepared Meal');
  const [servings, setServings] = useState(FOOD_SAMPLE_PRESETS[0].servings);
  const [weightKg, setWeightKg] = useState(FOOD_SAMPLE_PRESETS[0].weightKg);
  const [temperature, setTemperature] = useState(FOOD_SAMPLE_PRESETS[0].temp);
  const [storageCondition, setStorageCondition] = useState<'Hot Holding (>60°C)' | 'Refrigerated (<4°C)' | 'Room Temp (Ambient)' | 'Frozen (< -18°C)'>('Hot Holding (>60°C)');
  const [packagingType, setPackagingType] = useState<'Sealed Containers' | 'Covered Trays' | 'Boxes' | 'Bulk Pans'>('Sealed Containers');
  const [dietaryType, setDietaryType] = useState<'Vegetarian' | 'Vegan' | 'Halal' | 'Gluten-Free' | 'Jain'>('Vegetarian');
  const [allergens, setAllergens] = useState(FOOD_SAMPLE_PRESETS[0].allergens);
  const [donorVenue, setDonorVenue] = useState(FOOD_SAMPLE_PRESETS[0].venue);
  const [donorName, setDonorName] = useState(FOOD_SAMPLE_PRESETS[0].donor);
  const [address, setAddress] = useState(FOOD_SAMPLE_PRESETS[0].address);
  const [imageUrl, setImageUrl] = useState(FOOD_SAMPLE_PRESETS[0].image);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('AI Vision ready');
  const [submittedListing, setSubmittedListing] = useState<FoodListing | null>(null);

  // Dynamic AI Hygiene & HACCP Safety Score calculation
  const prepTimeAgo = 25; // minutes ago
  const isOptimalTemp = (temperature >= 63) || (temperature <= 4) || (category === 'Bakery & Pastry' && temperature <= 25);
  const safetyScore = isOptimalTemp ? 96 : temperature >= 55 ? 84 : 68;
  const safetyStatus = safetyScore >= 90 ? 'Good for rescue' : 'Requires fast delivery';
  const detectedItems = ['Basmati Rice', 'Steamed Veggies', 'Yogurt Dip', 'Hot Chafing Unit'];

  const handleSelectPreset = (preset: typeof FOOD_SAMPLE_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category === 'Cooked Meals' ? 'Prepared Meal' : preset.category === 'Bakery' ? 'Bakery & Pastry' : 'Fresh Produce');
    setServings(preset.servings);
    setWeightKg(preset.weightKg);
    setTemperature(preset.temp);
    setStorageCondition(preset.temp >= 60 ? 'Hot Holding (>60°C)' : preset.temp <= 4 ? 'Refrigerated (<4°C)' : 'Room Temp (Ambient)');
    setPackagingType(preset.pkg.includes('Sealed') ? 'Sealed Containers' : preset.pkg.includes('Trays') ? 'Covered Trays' : 'Boxes');
    setDietaryType(preset.diet as any);
    setAllergens(preset.allergens);
    setDonorVenue(preset.venue);
    setDonorName(preset.donor);
    setAddress(preset.address);
    setImageUrl(preset.image);
    handleTriggerAIScan();
  };

  const handleTriggerAIScan = () => {
    setIsScanning(true);
    setScanStepText('Analyzing thermal camera capture...');
    setTimeout(() => {
      setScanStepText('Verifying HACCP hygiene compliance...');
    }, 700);
    setTimeout(() => {
      setScanStepText('Safety parameters verified: Score 96/100');
      setIsScanning(false);
    }, 1400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `lst-${Date.now().toString().slice(-4)}`;
    const passId = `PAS-${Math.floor(100000 + Math.random() * 900000)}`;

    const created: FoodListing = createListing({
      id: newId,
      passportId: passId,
      title,
      donorId: 'donor-1',
      donorName,
      donorType: 'Convention Hall',
      category,
      items: detectedItems,
      servings: Number(servings),
      weightKg: Number(weightKg),
      preparedAt: new Date(Date.now() - prepTimeAgo * 60000).toISOString(),
      expiryAt: new Date(Date.now() + 3.5 * 3600000).toISOString(),
      pickupWindowStart: '7:30 PM',
      pickupWindowEnd: '9:00 PM',
      urgency: 'High',
      safety: {
        score: safetyScore,
        status: safetyScore >= 80 ? 'Good for rescue' : 'Verify storage',
        prepTimeAgoMinutes: prepTimeAgo,
        temperatureCelsius: Number(temperature),
        storageCondition,
        packagingType,
        allergens: allergens ? allergens.split(',').map((s) => s.trim()) : [],
        dietary: [dietaryType],
        verifiedByAi: true,
        notes: 'Thermal and visual inspection verified by HACCP AI module.',
      },
      location: {
        lat: 19.0688,
        lng: 72.8702,
        address,
        city: 'Mumbai',
      },
      imageUrl,
      status: 'Available',
      currentRadiusKm: 5,
      isEmergencyAlert: false,
      createdAt: new Date().toISOString(),
    });

    triggerConfetti();
    setSelectedListing(created);
    setSubmittedListing(created);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 w-full px-2 sm:px-0">
      {/* If submitted, show clean animated confirmation screen */}
      <AnimatePresence>
        {submittedListing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 sm:p-12 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] text-center shadow-xl space-y-6 max-w-2xl mx-auto"
          >
            {/* Friendly Food-Rescue Success Illustration */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping opacity-40" />
              <div className="w-20 h-20 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Successfully Published to Rescue Radar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {submittedListing.servings} Meals Ready for Rescue!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Your surplus listing for <strong>{submittedListing.title}</strong> has been registered on the municipal rescue grid with food passport ID <span className="font-mono text-purple-300 font-bold">{submittedListing.passportId}</span>.
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] text-xs grid grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono">Portions</span>
                <div className="font-bold font-mono text-slate-100 text-base">{submittedListing.servings} meals</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono">Safety Score</span>
                <div className="font-bold font-mono text-purple-300 text-base">{submittedListing.safety.score}/100</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono">Status</span>
                <div className="font-bold text-amber-300 text-sm">Available</div>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('matching')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-purple-100" />
                <span>Proceed to Smart Matching</span>
                <ArrowRight className="w-4 h-4 text-purple-100" />
              </button>

              <button
                onClick={() => setCurrentView('live-radar')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#0E142E] hover:bg-[#151D40] text-slate-200 font-semibold text-xs border border-[#222E54] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>View on Rescue Radar</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">List Surplus Food</h1>
                <p className="text-xs text-slate-400">
                  Enter surplus details or select a quick preset. Our model verifies storage conditions, estimates safe portions, and dispatches rescuers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerAIScan()}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-[#0E142E] hover:bg-[#151D40] text-slate-200 font-semibold text-xs border border-[#222E54] shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-Analyze with AI</span>
              </button>
            </div>

            {/* Preset Fast Picker */}
            <div className="p-4 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] space-y-2 shadow-md">
              <span className="text-xs font-semibold text-slate-300">Quick Kitchen Presets:</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {FOOD_SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2.5 rounded-2xl border border-[#222E54] bg-[#070A18] hover:border-purple-500/60 hover:bg-[#0E142E] text-left transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 truncate">
                      {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                      {preset.servings} meals · {preset.storage.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form + Live AI Safety Card */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Col: Form fields */}
              <div className="lg:col-span-7 space-y-4 min-w-0">
                <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-4 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-purple-400" />
                    <span>Surplus Batch Specifications</span>
                  </h3>

                  {/* Food Title */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Listing Title / Dish Description
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 50 Servings Vegetable Biryani"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>

                  {/* Category & Dietary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Food Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Prepared Meal">Prepared Meal (Hot/Cold)</option>
                        <option value="Bakery & Pastry">Bakery & Pastry</option>
                        <option value="Fresh Produce">Fresh Produce & Salads</option>
                        <option value="Packaged Goods">Packaged Goods</option>
                        <option value="Buffet Surplus">Buffet Surplus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Dietary Classification</label>
                      <select
                        value={dietaryType}
                        onChange={(e) => setDietaryType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Vegetarian">Pure Vegetarian</option>
                        <option value="Vegan">Vegan (100% Plant-Based)</option>
                        <option value="Halal">Halal Verified</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Jain">Jain Compliant</option>
                      </select>
                    </div>
                  </div>

                  {/* Servings & Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Servings (Portions)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Total Weight (kg)</label>
                      <input
                        type="number"
                        required
                        min="0.5"
                        step="0.5"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Donor & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Donor Venue Name</label>
                      <input
                        type="text"
                        required
                        value={donorVenue}
                        onChange={(e) => setDonorVenue(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Current Storage Core Temperature (°C)
                    </label>
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Col: AI Scanning Animation + Food Safety Gauge + Submit */}
              <div className="lg:col-span-5 space-y-4 min-w-0">
                <div className="p-5 sm:p-6 rounded-3xl bg-[#0A0E22]/95 border border-[#1E2648] shadow-xl space-y-5 min-w-0">
                  {/* Visual Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#1E2648] h-44 bg-[#070A18]">
                    <img
                      src={imageUrl}
                      alt="Food Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning Animation */}
                    <AnimatePresence>
                      {isScanning && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#070A18]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center"
                        >
                          <div className="w-full absolute top-0 left-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-xs animate-bounce" />
                          <Camera className="w-8 h-8 text-purple-400 animate-pulse mb-2" />
                          <div className="text-xs font-bold text-slate-100">AI Vision Analysis Active</div>
                          <div className="text-[11px] text-purple-300 mt-1 font-mono font-medium">{scanStepText}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AI Detected Items */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">AI Detected Components:</span>
                      <span className="text-[11px] text-purple-300 font-mono font-medium">Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedItems.map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-[#0E142E] border border-[#222E54] text-[11px] text-slate-300 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-purple-400" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Food Safety Gauge */}
                  <div className="p-4 rounded-2xl bg-[#070A18] border border-[#1E2648] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          <span>Food Safety Score</span>
                        </h4>
                        <p className="text-[10px] text-slate-400">Thermal & Packaging Verification</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          safetyStatus === 'Good for rescue'
                            ? 'bg-purple-950/80 border border-purple-500/40 text-purple-300'
                            : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                        }`}
                      >
                        {safetyStatus}
                      </span>
                    </div>

                    {/* Progress Circle */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-[#1E2648]"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-purple-500 transition-all duration-1000"
                            strokeDasharray={`${safetyScore}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-lg font-extrabold text-slate-100 font-mono">
                            {safetyScore}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">/100</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 min-w-0">
                        <div className="text-slate-200 leading-snug">
                          <strong className="text-purple-300">High Confidence:</strong> Safe for immediate distribution.
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug">
                          Calculated from preparation age ({prepTimeAgo}m), storage method, and core reading ({temperature}°C).
                        </div>
                      </div>
                    </div>

                    {/* Decision Support Disclaimer */}
                    <div className="p-2.5 rounded-xl bg-[#0E142E] border border-[#222E54] text-[10px] text-slate-400 leading-relaxed flex items-start gap-1.5 shadow-xs">
                      <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>HACCP Decision Support:</strong> Algorithmic estimation based on municipal hygiene guidelines. Visual inspection and standard sensory checks should be completed upon physical handover.
                      </span>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
                  >
                    <span>List Food & Launch Smart Match Engine</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-100" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
