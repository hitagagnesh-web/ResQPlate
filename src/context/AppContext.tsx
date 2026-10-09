import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  FoodListing,
  SurplusPrediction,
  NgoRecipient,
  Volunteer,
  RescueRoute,
  FoodPassport,
  ImpactStats,
  SystemNotification,
  AchievementBadge,
  RescueStatus,
} from '../types';
import {
  INITIAL_PREDICTIONS,
  INITIAL_LISTINGS,
  INITIAL_NGOS,
  INITIAL_VOLUNTEERS,
  INITIAL_OPTIMIZED_ROUTE,
  INITIAL_FOOD_PASSPORTS,
  INITIAL_IMPACT_STATS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES,
} from '../data/mockData';

export type AppView = 
  | 'landing'
  | 'future-radar'
  | 'live-radar'
  | 'new-listing'
  | 'matching'
  | 'route-optimizer'
  | 'food-passport'
  | 'impact'
  | 'dashboard';

interface AppContextType {
  // Navigation & Preferences
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Domain Entities
  listings: FoodListing[];
  predictions: SurplusPrediction[];
  ngos: NgoRecipient[];
  volunteers: Volunteer[];
  activeRoute: RescueRoute;
  passports: FoodPassport[];
  impactStats: ImpactStats;
  notifications: SystemNotification[];
  badges: AchievementBadge[];

  // Selection & Details
  selectedListing: FoodListing | null;
  setSelectedListing: (listing: FoodListing | null) => void;
  selectedPrediction: SurplusPrediction | null;
  setSelectedPrediction: (pred: SurplusPrediction | null) => void;
  selectedPassport: FoodPassport | null;
  setSelectedPassport: (passport: FoodPassport | null) => void;

  // Actions
  createListing: (listing: Partial<FoodListing>) => FoodListing;
  claimRescue: (listingId: string, ngoId: string) => void;
  assignVolunteer: (listingId: string, volunteerId: string) => void;
  advanceListingStatus: (listingId: string, targetStatus?: RescueStatus) => void;
  expandRescueRadius: (listingId: string) => void;
  prepareRescueFromPrediction: (predictionId: string) => FoodListing;
  updateRouteStops: (newStops: RescueRoute['stops']) => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: SystemNotification['type']) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');

  // Entities
  const [listings, setListings] = useState<FoodListing[]>(INITIAL_LISTINGS);
  const [predictions, setPredictions] = useState<SurplusPrediction[]>(INITIAL_PREDICTIONS);
  const [ngos] = useState<NgoRecipient[]>(INITIAL_NGOS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [activeRoute, setActiveRoute] = useState<RescueRoute>(INITIAL_OPTIMIZED_ROUTE);
  const [passports, setPassports] = useState<FoodPassport[]>(INITIAL_FOOD_PASSPORTS);
  const [impactStats, setImpactStats] = useState<ImpactStats>(INITIAL_IMPACT_STATS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [badges, setBadges] = useState<AchievementBadge[]>(INITIAL_BADGES);

  // Active selections
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(INITIAL_LISTINGS[0]);
  const [selectedPrediction, setSelectedPrediction] = useState<SurplusPrediction | null>(INITIAL_PREDICTIONS[0]);
  const [selectedPassport, setSelectedPassport] = useState<FoodPassport | null>(INITIAL_FOOD_PASSPORTS[0]);

  // Ensure clean light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#38bdf8', '#fb923c', '#a78bfa', '#fbbf24'],
      });
    } catch (e) {
      // fallback safe
    }
  };

  const addNotification = (
    title: string,
    message: string,
    type: SystemNotification['type'] = 'info'
  ) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Create new listing
  const createListing = (data: Partial<FoodListing>): FoodListing => {
    const newId = `lst-${Date.now()}`;
    const newPassportId = `FRR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const created: FoodListing = {
      id: newId,
      passportId: newPassportId,
      title: data.title || 'Fresh Surplus Banquet Platter',
      donorId: data.donorId || 'dnr-user',
      donorName: data.donorName || 'Artisan Table Kitchen',
      donorType: data.donorType || 'Restaurant',
      category: data.category || 'Prepared Meal',
      items: data.items || ['Steamed Rice', 'Lentil Curry', 'Flatbreads'],
      servings: data.servings || 50,
      weightKg: data.weightKg || 25,
      preparedAt: data.preparedAt || nowIso,
      expiryAt: data.expiryAt || new Date(Date.now() + 3.5 * 3600000).toISOString(),
      pickupWindowStart: data.pickupWindowStart || nowIso,
      pickupWindowEnd: data.pickupWindowEnd || new Date(Date.now() + 1.5 * 3600000).toISOString(),
      urgency: data.urgency || 'High',
      safety: data.safety || {
        score: 93,
        status: 'Good for rescue',
        prepTimeAgoMinutes: 40,
        temperatureCelsius: 65,
        storageCondition: 'Hot Holding (>60°C)',
        packagingType: 'Sealed Containers',
        allergens: ['Dairy'],
        dietary: ['Vegetarian'],
        verifiedByAi: true,
        notes: 'Thermal retention validated.',
      },
      location: data.location || {
        lat: 19.0760,
        lng: 72.8777,
        address: 'BKC Central Avenue',
        city: 'Mumbai',
      },
      status: 'Available',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      currentRadiusKm: 2,
      isEmergencyAlert: false,
      createdAt: nowIso,
    };

    setListings((prev) => [created, ...prev]);

    // Create corresponding Food Passport
    const newPassport: FoodPassport = {
      passportId: newPassportId,
      listingId: newId,
      foodName: created.title,
      category: created.category,
      donorName: created.donorName,
      recipientName: 'Matching in progress...',
      volunteerName: 'Awaiting dispatch',
      servings: created.servings,
      weightKg: created.weightKg,
      co2AvoidedKg: Number((created.weightKg * 1.85).toFixed(1)),
      batchHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      qrPayload: `https://resqplate.app/verify/${newPassportId}`,
      completed: false,
      milestones: [
        {
          stage: 'Prepared',
          timestamp: created.preparedAt,
          location: created.location.address,
          actor: created.donorName,
          role: 'Kitchen Producer',
          verifiedHash: '0xprep91823a',
          temperatureCelsius: created.safety.temperatureCelsius,
          notes: 'Prepared under standard HACCP culinary guidelines.',
        },
        {
          stage: 'Listed',
          timestamp: created.createdAt,
          location: created.location.address,
          actor: 'ResQPlate AI Scanner',
          role: 'Quality Assurance Agent',
          verifiedHash: '0xlst88124b',
          temperatureCelsius: created.safety.temperatureCelsius,
          notes: `Safety verified: Score ${created.safety.score}/100.`,
        },
      ],
    };

    setPassports((prev) => [newPassport, ...prev]);
    setSelectedListing(created);
    setSelectedPassport(newPassport);

    addNotification(
      '🍲 New Food Surplus Listed',
      `"${created.title}" (${created.servings} servings) is now available for smart matching.`,
      'info'
    );

    return created;
  };

  // Convert Future Prediction into active Food Listing
  const prepareRescueFromPrediction = (predictionId: string): FoodListing => {
    const pred = predictions.find((p) => p.id === predictionId) || predictions[0];
    
    // Mark prediction as surplus confirmed
    setPredictions((prev) =>
      prev.map((p) => (p.id === predictionId ? { ...p, status: 'surplus_confirmed' } : p))
    );

    const nowIso = new Date().toISOString();
    const servings = Math.round((pred.estimatedServingsMin + pred.estimatedServingsMax) / 2);
    const weight = Math.round(servings * 0.48);

    const listing = createListing({
      title: `${pred.venueName} Buffet Surplus`,
      donorName: pred.venueName,
      donorType: pred.venueType === 'Convention Hall' ? 'Convention Hall' : 'Hotel',
      category: 'Buffet Surplus',
      items: ['Shahi Paneer Entree', 'Fragrant Basmati Biryani', 'Dal Makhani', 'Artisan Naan'],
      servings,
      weightKg: weight,
      preparedAt: nowIso,
      urgency: 'High',
      location: pred.location,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    });

    addNotification(
      '🔮 Prediction Converted to Live Rescue',
      `Surplus from ${pred.venueName} confirmed! Matching engine activated.`,
      'prediction'
    );

    return listing;
  };

  // Claim rescue for NGO
  const claimRescue = (listingId: string, ngoId: string) => {
    const ngo = ngos.find((n) => n.id === ngoId);
    if (!ngo) return;

    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          return {
            ...l,
            status: 'Claimed',
            claimedByNgoId: ngo.id,
            claimedByNgoName: ngo.name,
          };
        }
        return l;
      })
    );

    // Update passport
    setPassports((prev) =>
      prev.map((p) => {
        if (p.listingId === listingId) {
          return {
            ...p,
            recipientName: ngo.name,
            milestones: [
              ...p.milestones,
              {
                stage: 'Matched',
                timestamp: new Date().toISOString(),
                location: ngo.location.address,
                actor: ngo.contactPerson,
                role: 'Recipient Recipient',
                verifiedHash: `0xmatch${Math.random().toString(16).slice(2, 8)}`,
                notes: `Matched to ${ngo.name} based on 96% optimal requirement fit.`,
              },
            ],
          };
        }
        return p;
      })
    );

    addNotification(
      '🤝 Recipient Matched',
      `${ngo.name} claimed the rescue. Dispatching available volunteer...`,
      'match'
    );
  };

  // Assign volunteer
  const assignVolunteer = (listingId: string, volunteerId: string) => {
    const vol = volunteers.find((v) => v.id === volunteerId) || volunteers[0];

    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          return {
            ...l,
            status: 'Volunteer Assigned',
            assignedVolunteerId: vol.id,
            assignedVolunteerName: vol.name,
          };
        }
        return l;
      })
    );

    setVolunteers((prev) =>
      prev.map((v) => (v.id === vol.id ? { ...v, activeRescueId: listingId } : v))
    );

    setPassports((prev) =>
      prev.map((p) => (p.listingId === listingId ? { ...p, volunteerName: `${vol.name} (${vol.vehicleType})` } : p))
    );

    addNotification(
      '🚗 Volunteer Assigned',
      `${vol.name} (${vol.vehicleType}) accepted rescue pickup.`,
      'volunteer'
    );
  };

  // Expand rescue radius
  const expandRescueRadius = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const nextRadius = l.currentRadiusKm === 2 ? 5 : l.currentRadiusKm === 5 ? 10 : 15;
          return {
            ...l,
            currentRadiusKm: nextRadius,
            isEmergencyAlert: true,
            urgency: 'Critical',
          };
        }
        return l;
      })
    );

    addNotification(
      '🚨 Rescue Network Expanding',
      `Radius expanded to 5km -> 10km to alert additional volunteers for urgent pickup!`,
      'emergency'
    );
  };

  // Advance lifecycle status
  const advanceListingStatus = (listingId: string, targetStatus?: RescueStatus) => {
    const current = listings.find((l) => l.id === listingId);
    if (!current) return;

    const sequence: RescueStatus[] = [
      'Available',
      'Claimed',
      'Volunteer Assigned',
      'Pickup In Progress',
      'Picked Up',
      'Delivered',
    ];

    const next = targetStatus || sequence[Math.min(sequence.length - 1, sequence.indexOf(current.status) + 1)];

    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: next } : l))
    );

    // Update passport & stats
    const nowIso = new Date().toISOString();
    if (next === 'Picked Up') {
      setPassports((prev) =>
        prev.map((p) => {
          if (p.listingId === listingId) {
            return {
              ...p,
              milestones: [
                ...p.milestones,
                {
                  stage: 'Picked Up',
                  timestamp: nowIso,
                  location: current.location.address,
                  actor: current.assignedVolunteerName || 'Rahul Verma',
                  role: 'Volunteer Driver',
                  verifiedHash: `0xpk${Math.random().toString(16).slice(2, 8)}`,
                  temperatureCelsius: current.safety.temperatureCelsius - 2.5,
                  notes: 'Secured in insulated thermal containers for transit.',
                },
              ],
            };
          }
          return p;
        })
      );
      addNotification('📦 Food Picked Up', `Volunteer has secured food from ${current.donorName}. Transit underway.`, 'info');
    } else if (next === 'Delivered') {
      triggerConfetti();
      setPassports((prev) =>
        prev.map((p) => {
          if (p.listingId === listingId) {
            return {
              ...p,
              completed: true,
              milestones: [
                ...p.milestones,
                {
                  stage: 'Delivered',
                  timestamp: nowIso,
                  location: current.claimedByNgoName || 'Hope Foundation',
                  actor: 'Sister Mary Fernandes',
                  role: 'Recipient Recipient Sign-off',
                  verifiedHash: `0xdlv${Math.random().toString(16).slice(2, 8)}`,
                  temperatureCelsius: current.safety.temperatureCelsius - 4.5,
                  notes: `100% verified distribution. ${current.servings} meals served with zero waste.`,
                },
              ],
            };
          }
          return p;
        })
      );

      // Update Impact stats
      setImpactStats((prev) => ({
        ...prev,
        mealsRescued: prev.mealsRescued + current.servings,
        foodSavedKg: prev.foodSavedKg + current.weightKg,
        co2AvoidedKg: Number((prev.co2AvoidedKg + current.weightKg * 1.85).toFixed(1)),
        peopleServed: prev.peopleServed + current.servings,
        economicValueInr: prev.economicValueInr + current.servings * 85,
        rescueSuccessRate: 95.1,
      }));

      // Unlock badge if not unlocked
      setBadges((prev) =>
        prev.map((b) => (b.id === 'badge-4' ? { ...b, unlocked: true, progressPercent: 100 } : b))
      );

      addNotification(
        '🎉 Rescue Successfully Delivered!',
        `${current.servings} meals arrived safely at ${current.claimedByNgoName || 'Hope Foundation'}. Passport minted!`,
        'delivery'
      );
    }
  };

  const updateRouteStops = (newStops: RescueRoute['stops']) => {
    setActiveRoute((prev) => ({
      ...prev,
      stops: newStops,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentRole,
        setCurrentRole,
        listings,
        predictions,
        ngos,
        volunteers,
        activeRoute,
        passports,
        impactStats,
        notifications,
        badges,
        selectedListing,
        setSelectedListing,
        selectedPrediction,
        setSelectedPrediction,
        selectedPassport,
        setSelectedPassport,
        createListing,
        claimRescue,
        assignVolunteer,
        advanceListingStatus,
        expandRescueRadius,
        prepareRescueFromPrediction,
        updateRouteStops,
        markNotificationAsRead,
        addNotification,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
