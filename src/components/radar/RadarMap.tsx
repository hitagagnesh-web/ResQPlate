import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  AlertTriangle,
  Navigation,
  Building2,
  Bike,
  Truck,
  MapPin,
  Compass,
  Layers,
  HeartHandshake,
  Package,
  Clock,
  Thermometer,
  BatteryCharging,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Target,
  Move,
  Crosshair,
  User,
  Flag,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CircularRescueRadar } from './CircularRescueRadar';
import { FoodListing, SurplusPrediction, RouteStop } from '../../types';

interface RadarMapProps {
  mode?: 'future' | 'live' | 'route' | 'all';
  predictions?: SurplusPrediction[];
  listings?: FoodListing[];
  timeFilter?: string;
  typeFilter?: string;
  highlightId?: string;
  onMarkerSelect?: (item: any, type: 'prediction' | 'listing' | 'ngo' | 'volunteer' | 'stop') => void;
  className?: string;
  defaultView?: 'circular' | 'grid';
}

interface ActiveCourier {
  id: string;
  name: string;
  vehicleType: string;
  vehicleIcon: 'bike' | 'truck';
  vehicleNumber: string;
  origin: string;
  destination: string;
  destinationCoords: { lat: number; lng: number };
  startCoords: { lat: number; lng: number };
  mealsCount: number;
  speedKmH: number;
  remainingKm: number;
  etaMins: number;
  status: string;
  badgeClass: string;
  ringClass: string;
  pathStroke: string;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  mode = 'all',
  predictions: customPredictions,
  listings: customListings,
  timeFilter = 'all',
  typeFilter = 'all',
  highlightId,
  onMarkerSelect,
  className = '',
  defaultView = 'grid',
}) => {
  const {
    predictions: contextPredictions,
    listings: contextListings,
    ngos,
    activeRoute,
    selectedPrediction,
    setSelectedPrediction,
    selectedListing,
    setSelectedListing,
  } = useApp();

  const [activeDisplay, setActiveDisplay] = useState<'circular' | 'grid'>(
    mode === 'route' ? 'grid' : defaultView
  );

  // Selected courier details modal
  const [selectedCourier, setSelectedCourier] = useState<ActiveCourier | null>(null);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);

  // Dynamic Map Pan as Cursor Moves
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isCursorPanActive, setIsCursorPanActive] = useState(true);
  const [isHoveringMap, setIsHoveringMap] = useState(false);
  const [cursorTelemetry, setCursorTelemetry] = useState<{
    lat: string;
    lng: string;
    px: number;
    py: number;
  } | null>(null);

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });

  // Focus effect for any courier
  const [focusedCourierId, setFocusedCourierId] = useState<string | null>(null);
  const [showRiderMenu, setShowRiderMenu] = useState(false);

  const [filterLayer, setFilterLayer] = useState<{
    showPredictions: boolean;
    showRescues: boolean;
    showNgos: boolean;
    showRoutes: boolean;
    showCouriers: boolean;
  }>({
    showPredictions: true,
    showRescues: true,
    showNgos: true,
    showRoutes: true,
    showCouriers: true,
  });

  const rawPredictions = customPredictions || contextPredictions;
  const rawListings = customListings || contextListings;

  // Filter predictions
  const activePredictions = rawPredictions.filter((p) => {
    if (timeFilter !== 'all' && p.timeframeCategory !== timeFilter) return false;
    if (typeFilter !== 'all' && !p.venueType.toLowerCase().includes(typeFilter.toLowerCase())) return false;
    return true;
  });

  const activeListings = rawListings;

  // Dynamic zoom for central corridor
  // Dynamic projection bounds ensuring full metropolitan visibility
  const isCloseZoom = timeFilter === 'Next 1h' || mode === 'route';
  const latMin = isCloseZoom ? 19.020 : 19.018;
  const latMax = isCloseZoom ? 19.140 : 19.145;
  const lngMin = isCloseZoom ? 72.818 : 72.815;
  const lngMax = isCloseZoom ? 72.922 : 72.925;

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 740 + 30;
    const y = 570 - ((lat - latMin) / (latMax - latMin)) * 520;
    return { x: Math.max(35, Math.min(765, x)), y: Math.max(35, Math.min(565, y)) };
  };

  // Fleet of active couriers with steady progress traveling toward their destinations
  const [fleetProgress, setFleetProgress] = useState(0.42);

  useEffect(() => {
    const interval = setInterval(() => {
      setFleetProgress((prev) => (prev >= 0.98 ? 0.05 : prev + 0.0018));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Defined fleet of active riders widely scattered across 5 distinct metropolitan sectors
  const couriers: ActiveCourier[] = [
    {
      id: 'vol-rahul',
      name: 'Rahul Verma',
      vehicleType: 'Cargo E-Bike',
      vehicleIcon: 'bike',
      vehicleNumber: '#B-401 (Zero-Emission)',
      origin: 'Khar West Artisanal Kitchens',
      destination: 'Bandra Coastal Relief Shelter',
      startCoords: { lat: 19.1080, lng: 72.8310 }, // Northwest / Coast
      destinationCoords: { lat: 19.0480, lng: 72.8250 }, // Southwest Coast
      mealsCount: 125,
      speedKmH: 23,
      remainingKm: 0.8,
      etaMins: 3,
      status: 'En Route to Shelter Dropoff',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      ringClass: 'ring-purple-300',
      pathStroke: '#8B5CF6',
    },
    {
      id: 'vol-priya',
      name: 'Priya Sharma',
      vehicleType: 'Insulated Electric Van',
      vehicleIcon: 'truck',
      vehicleNumber: '#V-108 (Thermal Boxed)',
      origin: 'BKC East Convention Halls',
      destination: 'Sion Chunabhatti Community Center',
      startCoords: { lat: 19.0960, lng: 72.8980 }, // East Corridor
      destinationCoords: { lat: 19.0380, lng: 72.9120 }, // Southeast Corridor
      mealsCount: 180,
      speedKmH: 34,
      remainingKm: 1.4,
      etaMins: 5,
      status: 'En Route to Shelter Dropoff',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
      ringClass: 'ring-sky-300',
      pathStroke: '#0284C7',
    },
    {
      id: 'vol-amit',
      name: 'Amit Patel',
      vehicleType: 'Delivery Scooter',
      vehicleIcon: 'bike',
      vehicleNumber: '#S-205 (Rapid Courier)',
      origin: 'Santacruz North Catering Hub',
      destination: 'Kalina Academic Night Shelter',
      startCoords: { lat: 19.1280, lng: 72.8560 }, // North Suburbs
      destinationCoords: { lat: 19.0820, lng: 72.8680 }, // North Central
      mealsCount: 45,
      speedKmH: 28,
      remainingKm: 2.1,
      etaMins: 7,
      status: 'En Route to Shelter Dropoff',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      ringClass: 'ring-amber-300',
      pathStroke: '#F59E0B',
    },
    {
      id: 'vol-sneha',
      name: 'Sneha Nair',
      vehicleType: 'Rapid Cargo E-Bike',
      vehicleIcon: 'bike',
      vehicleNumber: '#B-309 (Pantry Express)',
      origin: 'Dadar South Bakery Terminal',
      destination: 'Mahim Seva Community Kitchen',
      startCoords: { lat: 19.0260, lng: 72.8460 }, // South Sector
      destinationCoords: { lat: 19.0620, lng: 72.8580 }, // South-Central
      mealsCount: 60,
      speedKmH: 21,
      remainingKm: 1.1,
      etaMins: 4,
      status: 'En Route to Shelter Dropoff',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      ringClass: 'ring-rose-300',
      pathStroke: '#F43F5E',
    },
    {
      id: 'vol-vikram',
      name: 'Vikram Joshi',
      vehicleType: 'EV Heavy Cargo Van',
      vehicleIcon: 'truck',
      vehicleNumber: '#V-304 (Heavy Dispatch)',
      origin: 'Powai Tech Mega Campus',
      destination: 'Annam Welfare Food Bank',
      startCoords: { lat: 19.1350, lng: 72.9060 }, // Northeast Powai
      destinationCoords: { lat: 19.0880, lng: 72.8840 }, // Mid-East Kurla
      mealsCount: 210,
      speedKmH: 38,
      remainingKm: 1.8,
      etaMins: 6,
      status: 'En Route to Shelter Dropoff',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      ringClass: 'ring-emerald-300',
      pathStroke: '#10B981',
    },
  ];

  // Helper to calculate a courier's interpolated position along their dedicated route
  const getCourierCurrentCoords = (c: ActiveCourier, offset: number) => {
    // Unique progress offset per courier so they move naturally at staggered intervals
    const prog = (fleetProgress + offset) % 1;
    const curLat = c.startCoords.lat + (c.destinationCoords.lat - c.startCoords.lat) * prog;
    const curLng = c.startCoords.lng + (c.destinationCoords.lng - c.startCoords.lng) * prog;
    return {
      pt: projectCoords(curLat, curLng),
      progressPercent: Math.round(prog * 100),
      currentLat: curLat.toFixed(4),
      currentLng: curLng.toFixed(4),
    };
  };

  // Cursor Move Handler: Lets the map smoothly move as the cursor moves
  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      setMapPan({
        x: Math.max(-130, Math.min(130, dragStartRef.current.panX + deltaX)),
        y: Math.max(-100, Math.min(100, dragStartRef.current.panY + deltaY)),
      });
      return;
    }

    if (isCursorPanActive) {
      const normX = mouseX / rect.width - 0.5;
      const normY = mouseY / rect.height - 0.5;
      const maxPanX = 80;
      const maxPanY = 60;
      setMapPan({
        x: -normX * maxPanX,
        y: -normY * maxPanY,
      });
    }

    const relX = Math.max(0, Math.min(1, mouseX / rect.width));
    const relY = Math.max(0, Math.min(1, mouseY / rect.height));
    const lat = (latMax - relY * (latMax - latMin)).toFixed(4);
    const lng = (lngMin + relX * (lngMax - lngMin)).toFixed(4);
    setCursorTelemetry({ lat, lng, px: mouseX, py: mouseY });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: mapPan.x,
      panY: mapPan.y,
    };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center Camera Directly on any selected rider
  const handleFocusOnCourier = (courier: ActiveCourier, index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const offsets = [0.15, 0.58, 0.82, 0.38, 0.72];
    const offset = offsets[index % offsets.length];
    const { pt } = getCourierCurrentCoords(courier, offset);
    const targetPanX = -((pt.x - 400) / 400) * 80;
    const targetPanY = -((pt.y - 300) / 300) * 60;
    setMapPan({
      x: Math.max(-120, Math.min(120, targetPanX)),
      y: Math.max(-90, Math.min(90, targetPanY)),
    });
    setFocusedCourierId(courier.id);
    setSelectedCourier(courier);
    setTimeout(() => setFocusedCourierId(null), 3000);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-lg flex flex-col ${className}`}
    >
      {/* Top View Mode & Fleet Header (Clean White & Pastel) */}
      <div className="px-3.5 py-2.5 bg-white/95 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">Interactive Transit Radar</span>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline truncate">
              · {couriers.length} Active Rescue Riders
            </span>
          </div>
        </div>

        {/* Action Controls: Multi-Rider Focus, Pan Toggle & View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {activeDisplay === 'grid' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRiderMenu(!showRiderMenu)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] border border-purple-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all transform active:scale-95"
                title="Locate any active rescue rider across the city"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                <span>Locate Rider</span>
                <ChevronDown className={`w-3 h-3 text-purple-600 transition-transform ${showRiderMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showRiderMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs space-y-0.5"
                  >
                    <div className="px-2 py-1 text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                      Select Active Rider ({couriers.length})
                    </div>
                    {couriers.map((courier, idx) => {
                      const VehicleIcon = courier.vehicleIcon === 'bike' ? Bike : Truck;
                      return (
                        <button
                          key={courier.id}
                          type="button"
                          onClick={() => {
                            handleFocusOnCourier(courier, idx);
                            setShowRiderMenu(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50/80 transition-colors text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-purple-100 text-slate-700 group-hover:text-purple-700 flex items-center justify-center shrink-0">
                              <VehicleIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 text-xs truncate group-hover:text-purple-900">
                                {courier.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                → {courier.destination.split(' ')[0]} {courier.destination.split(' ')[1] || ''}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-purple-600 font-semibold shrink-0">
                            {courier.speedKmH}km/h
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeDisplay === 'grid' && (
            <button
              type="button"
              onClick={() => setIsCursorPanActive(!isCursorPanActive)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isCursorPanActive
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
              }`}
              title="When enabled, map moves naturally as cursor moves"
            >
              <Move className="w-3 h-3 text-sky-600" />
              <span className="hidden md:inline font-mono">
                {isCursorPanActive ? 'Cursor Pan: ON' : 'Cursor Pan: OFF'}
              </span>
            </button>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveDisplay('circular')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeDisplay === 'circular'
                  ? 'bg-white text-purple-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Sweep</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDisplay('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeDisplay === 'grid'
                  ? 'bg-white text-sky-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {activeDisplay === 'circular' ? (
        <CircularRescueRadar
          className="border-0 shadow-none rounded-none flex-1"
          mode={mode}
          predictions={activePredictions}
          listings={activeListings}
          timeFilter={timeFilter}
          typeFilter={typeFilter}
          showHeader={false}
          onSelectListing={(l) => {
            if (onMarkerSelect) onMarkerSelect(l, 'listing');
          }}
          onSelectPrediction={(p) => {
            if (onMarkerSelect) onMarkerSelect(p, 'prediction');
          }}
          selectedId={highlightId}
        />
      ) : (
        /* INTERACTIVE MAP CONTAINER WITH CURSOR-MOVE PARALLAX (WHITE & PASTEL) */
        <div
          ref={mapContainerRef}
          onMouseMove={handleMapMouseMove}
          onMouseEnter={() => setIsHoveringMap(true)}
          onMouseLeave={() => {
            setIsHoveringMap(false);
            setIsDragging(false);
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`relative w-full h-[520px] select-none overflow-hidden bg-[#F8FAFC] ${
            isDragging ? 'cursor-grabbing' : 'cursor-crosshair'
          }`}
        >
          {/* Subtle Pastel Grid Dot Matrix */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* DYNAMIC MOVING MAP STAGE: Glides smoothly as cursor moves */}
          <div
            style={{
              transform: `translate3d(${mapPan.x}px, ${mapPan.y}px, 0)`,
              transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* SVG Canvas for Map Roadways, Coastal Silhouette & Polyline Routes */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="routeGradientPastelSoft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#0284C7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.85" />
                </linearGradient>

                <filter id="softRouteGlowLight" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Coastal Silhouette in Soft Pastel Indigo Tint */}
              <path
                d="M 60,30 Q 110,180 80,320 T 130,580 L 30,580 L 30,30 Z"
                fill="#EEF2FF"
                stroke="#C7D2FE"
                strokeWidth="1.5"
              />

              {/* Urban Arterial Highways in Soft Slate */}
              <path
                d="M 80,180 Q 240,210 420,180 T 740,240"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 80,180 Q 240,210 420,180 T 740,240"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              <path
                d="M 120,490 Q 320,380 500,420 T 760,350"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 120,490 Q 320,380 500,420 T 760,350"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              <path
                d="M 280,60 Q 340,320 310,540"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
              />
              <path
                d="M 520,70 Q 480,280 540,550"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
              />
              <path
                d="M 160,280 C 310,290 480,310 680,290"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
              />

              {/* Roadway corridor text in soft slate */}
              <text x="210" y="170" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1">
                LINKING ROAD TRANSIT
              </text>
              <text x="440" y="270" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1">
                BKC COMMERCIAL SECTOR
              </text>
              <text x="140" y="470" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1">
                BANDRA WEST HARBOR
              </text>
              <text x="490" y="415" fill="#94A3B8" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="1">
                CENTRAL EXPRESSWAY
              </text>

              {/* Courier Active Transit Corridors to Destination Shelters */}
              {couriers.map((c, idx) => {
                const s = projectCoords(c.startCoords.lat, c.startCoords.lng);
                const d = projectCoords(c.destinationCoords.lat, c.destinationCoords.lng);
                const midX = (s.x + d.x) / 2 + (idx % 2 === 0 ? 25 : -25);
                const midY = (s.y + d.y) / 2 + (idx % 2 === 0 ? -20 : 20);

                return (
                  <g key={`corridor-${c.id}`}>
                    {/* Road track */}
                    <path
                      d={`M ${s.x} ${s.y} Q ${midX} ${midY} ${d.x} ${d.y}`}
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Animated direction dashed path towards destination */}
                    <path
                      d={`M ${s.x} ${s.y} Q ${midX} ${midY} ${d.x} ${d.y}`}
                      fill="none"
                      stroke={c.pathStroke}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      opacity="0.8"
                    >
                      <animate attributeName="stroke-dashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
                    </path>
                  </g>
                );
              })}
            </svg>

            {/* Interactive HTML Markers, Couriers & Destinations Layer */}
            <div className="absolute inset-0 pointer-events-auto">
              {/* 1. DESTINATION SHELTERS (WHERE COURIERS ARE HEADING) */}
              {couriers.map((c) => {
                const d = projectCoords(c.destinationCoords.lat, c.destinationCoords.lng);
                const leftPercent = (d.x / 800) * 100;
                const topPercent = (d.y / 600) * 100;

                return (
                  <div
                    key={`dest-${c.id}`}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                    onClick={() => setSelectedCourier(c)}
                  >
                    <span className="absolute -inset-2.5 rounded-full bg-purple-200/60 animate-ping pointer-events-none" />
                    <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-slate-800 shadow-sm text-xs group-hover:scale-105 transition-transform">
                      <Flag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-mono font-bold text-purple-600 uppercase leading-none">
                          Destination
                        </span>
                        <span className="font-bold text-[11px] truncate max-w-[110px] text-slate-800">
                          {c.destination.split(' ')[0]} {c.destination.split(' ')[1] || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 2. ACTIVE COURIERS TRAVELING TOWARD DESTINATION */}
              {filterLayer.showCouriers &&
                couriers.map((c, idx) => {
                  const offsets = [0.15, 0.58, 0.82, 0.38, 0.72];
                  const offset = offsets[idx % offsets.length];
                  const { pt, progressPercent } = getCourierCurrentCoords(c, offset);
                  const isFocused = focusedCourierId === c.id || selectedCourier?.id === c.id;
                  const leftPercent = (pt.x / 800) * 100;
                  const topPercent = (pt.y / 600) * 100;

                  return (
                    <div
                      key={c.id}
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 group"
                      onClick={() => setSelectedCourier(c)}
                    >
                      {/* Luminous Pulsing Beacon */}
                      <span className={`absolute -inset-3.5 rounded-full ${isFocused ? 'bg-purple-300/60 animate-ping' : 'bg-sky-200/50 animate-pulse'} pointer-events-none`} />
                      {isFocused && (
                        <span className="absolute -inset-7 rounded-full bg-purple-400/50 animate-ping pointer-events-none" />
                      )}

                      {/* Clean White & Pastel Courier Pill */}
                      <div
                        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border-2 ${
                          isFocused
                            ? 'border-purple-500 shadow-md ring-2 ring-purple-100'
                            : 'border-slate-200 shadow-sm hover:border-sky-400'
                        } text-slate-800 transition-all transform hover:scale-110`}
                      >
                        {/* Fixed Rider Vehicle Icon (Shows in which vehicle the rider is travelling) */}
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            c.vehicleIcon === 'bike' ? 'bg-purple-50 text-purple-700' : 'bg-sky-50 text-sky-700'
                          }`}
                          title={`Travelling by ${c.vehicleType}`}
                        >
                          {c.vehicleIcon === 'bike' ? (
                            <Bike className="w-3.5 h-3.5 animate-bounce shrink-0" />
                          ) : (
                            <Truck className="w-3.5 h-3.5 animate-bounce shrink-0" />
                          )}
                        </div>

                        <div className="flex flex-col text-left pr-0.5">
                          <div className="flex items-center gap-1.5 leading-tight">
                            <span className="font-black text-xs text-slate-900 tracking-tight">
                              {c.name}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded-md border text-[9px] font-mono font-bold ${c.badgeClass}`}>
                              {c.vehicleType.includes('Van') ? 'Van' : 'Bike'}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1 leading-tight mt-0.5">
                            <span className="text-purple-600 font-bold">→ {c.destination.split(' ')[0]}</span>
                            <span>· {c.speedKmH} km/h · ETA {c.etaMins}m</span>
                          </span>
                        </div>
                      </div>

                      {/* Progress to destination bar under pill */}
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden border border-slate-200">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-sky-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

              {/* 3. FUTURE PREDICTIONS HOTSPOTS */}
              {(mode === 'future' || mode === 'all') &&
                filterLayer.showPredictions &&
                activePredictions.map((pred) => {
                  const pt = projectCoords(pred.location.lat, pred.location.lng);
                  const isSelected = selectedPrediction?.id === pred.id;
                  const leftPercent = (pt.x / 800) * 100;
                  const topPercent = (pt.y / 600) * 100;

                  return (
                    <div
                      key={pred.id}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                      onClick={() => {
                        setSelectedPrediction(pred);
                        if (onMarkerSelect) onMarkerSelect(pred, 'prediction');
                      }}
                    >
                      <div
                        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs transition-all transform hover:scale-105 ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300'
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
                      </div>
                    </div>
                  );
                })}

              {/* 4. ACTIVE RESCUE LISTINGS */}
              {(mode === 'live' || mode === 'all') &&
                filterLayer.showRescues &&
                activeListings.map((listing) => {
                  const pt = projectCoords(listing.location.lat, listing.location.lng);
                  const isSelected = selectedListing?.id === listing.id;
                  const isUrgent = listing.urgency === 'Critical' || listing.isEmergencyAlert;
                  const leftPercent = (pt.x / 800) * 100;
                  const topPercent = (pt.y / 600) * 100;

                  return (
                    <div
                      key={listing.id}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group"
                      onClick={() => {
                        setSelectedListing(listing);
                        if (onMarkerSelect) onMarkerSelect(listing, 'listing');
                      }}
                    >
                      <div
                        className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-2xs transition-all transform hover:scale-105 ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : isUrgent
                            ? 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        {isUrgent ? (
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
                              : isUrgent
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {listing.servings}m
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* 5. NGO COMMUNITY SHELTERS */}
              {filterLayer.showNgos &&
                ngos.map((ngo) => {
                  const pt = projectCoords(ngo.location.lat, ngo.location.lng);
                  const isSelected = selectedNgoId === ngo.id;
                  const leftPercent = (pt.x / 800) * 100;
                  const topPercent = (pt.y / 600) * 100;

                  return (
                    <div
                      key={ngo.id}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 group"
                      onClick={() => {
                        setSelectedNgoId(ngo.id);
                        if (onMarkerSelect) onMarkerSelect(ngo, 'ngo');
                      }}
                    >
                      <div
                        className={`p-1.5 rounded-xl border shadow-2xs transition-all transform hover:scale-110 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <HeartHandshake className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-semibold truncate max-w-[70px] hidden sm:inline">
                          {ngo.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* DYNAMIC CURSOR RETICLE HUD (Follows cursor across the map) */}
          {isHoveringMap && cursorTelemetry && (
            <div
              style={{
                left: `${cursorTelemetry.px}px`,
                top: `${cursorTelemetry.py}px`,
              }}
              className="absolute pointer-events-none z-35 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-8 h-8 rounded-full border border-purple-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-xs" />
              </div>

              <div className="absolute left-6 top-1 px-2 py-0.5 rounded-lg bg-white/95 border border-purple-200 text-[9px] font-mono text-purple-700 whitespace-nowrap shadow-sm flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-purple-500 animate-ping" />
                <span>
                  {cursorTelemetry.lat}°N, {cursorTelemetry.lng}°E
                </span>
              </div>
            </div>
          )}

          {/* INTERACTIVE POPUP MODAL: COURIER TELEMETRY & ROUTE PROGRESS (NO USER VEHICLE TOGGLE) */}
          <AnimatePresence>
            {selectedCourier && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-4 left-4 z-45 max-w-sm w-full p-4 rounded-3xl bg-white text-slate-800 border border-slate-200 shadow-2xl space-y-3"
              >
                {/* Header showing courier name and assigned vehicle */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                        selectedCourier.vehicleIcon === 'bike' ? 'bg-purple-600' : 'bg-sky-600'
                      }`}
                    >
                      {selectedCourier.vehicleIcon === 'bike' ? (
                        <Bike className="w-5 h-5" />
                      ) : (
                        <Truck className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-purple-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                        <span>ACTIVE COURIER EN ROUTE</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {selectedCourier.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        Travelling by: <span className="font-semibold text-slate-700">{selectedCourier.vehicleType}</span> ({selectedCourier.vehicleNumber})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCourier(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Transit Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Current Speed</span>
                    <span className="font-bold text-purple-700">{selectedCourier.speedKmH} km/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Remaining Distance</span>
                    <span className="font-bold text-sky-700">{selectedCourier.remainingKm} km (ETA {selectedCourier.etaMins}m)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Active Cargo</span>
                    <span className="font-bold text-slate-800">{selectedCourier.mealsCount} Meals</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">HACCP Temperature</span>
                    <span className="font-bold text-emerald-700">64.5°C (Safe)</span>
                  </div>
                </div>

                {/* Destination Waypoint Card */}
                <div className="text-xs space-y-1 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200">
                  <div className="text-[10px] text-purple-700 font-mono font-bold uppercase">
                    TARGET DESTINATION:
                  </div>
                  <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{selectedCourier.destination}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Departed from: {selectedCourier.origin}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedCourier(null)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all text-center"
                >
                  Close Courier Telemetry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Layer Controls in Bottom Right */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200 shadow-md text-xs">
            <button
              type="button"
              onClick={() => setFilterLayer((p) => ({ ...p, showCouriers: !p.showCouriers }))}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                filterLayer.showCouriers ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-3 h-3" />
              <span>Fleet</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterLayer((p) => ({ ...p, showRescues: !p.showRescues }))}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                filterLayer.showRescues ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Targets</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterLayer((p) => ({ ...p, showNgos: !p.showNgos }))}
              className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                filterLayer.showNgos ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3 h-3" />
              <span>Shelters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
