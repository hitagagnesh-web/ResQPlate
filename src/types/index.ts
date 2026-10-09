export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type FoodCategory = 'Prepared Meal' | 'Bakery & Pastry' | 'Fresh Produce' | 'Packaged Goods' | 'Dairy' | 'Buffet Surplus';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RescueStatus = 
  | 'Predicted'
  | 'Available'
  | 'Claimed'
  | 'Volunteer Assigned'
  | 'Pickup In Progress'
  | 'Picked Up'
  | 'Delivered'
  | 'Expired';

export type SafetyStatus = 'Good for rescue' | 'Verify storage' | 'Do not distribute';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export interface FoodSafetyReport {
  score: number; // 0-100
  status: SafetyStatus;
  prepTimeAgoMinutes: number;
  temperatureCelsius: number;
  storageCondition: 'Hot Holding (>60°C)' | 'Refrigerated (<4°C)' | 'Room Temp (Ambient)' | 'Frozen (< -18°C)';
  packagingType: 'Sealed Containers' | 'Covered Trays' | 'Boxes' | 'Bulk Pans';
  allergens: string[];
  dietary: ('Vegetarian' | 'Vegan' | 'Halal' | 'Gluten-Free' | 'Jain')[];
  verifiedByAi: boolean;
  notes: string;
}

export interface FoodListing {
  id: string;
  passportId: string;
  title: string;
  donorId: string;
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Convention Hall' | 'Bakery' | 'Cafeteria' | 'Hostel';
  donorAvatar?: string;
  category: FoodCategory;
  items: string[];
  servings: number;
  weightKg: number;
  preparedAt: string;
  expiryAt: string;
  expiresInMinutes?: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  urgency: UrgencyLevel;
  safety: FoodSafetyReport;
  location: LocationCoordinates;
  status: RescueStatus;
  imageUrl: string;
  claimedByNgoId?: string;
  claimedByNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  currentRadiusKm: number; // e.g. 2, 5, 10 for expanding radius
  isEmergencyAlert: boolean;
  createdAt: string;
}

export interface PredictionFactor {
  name: string;
  weight: number; // percentage
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface SurplusPrediction {
  id: string;
  venueName: string;
  venueType: 'Convention Hall' | 'Luxury Hotel' | 'Corporate Campus' | 'University Hostel' | 'Bakery Chain';
  location: LocationCoordinates;
  probability: number; // 0-100
  estimatedServingsMin: number;
  estimatedServingsMax: number;
  expectedTimeWindow: string; // e.g. "8:30 PM - 9:15 PM"
  confidence: 'High' | 'Medium' | 'Low';
  recommendedRescuers: number;
  eventDetails: {
    eventType: string;
    guestCount: number;
    menuType: string;
  };
  factors: PredictionFactor[];
  aiReasoning: string;
  timeframeCategory: 'Next 1h' | 'Next 3h' | 'Tonight' | 'Tomorrow';
  status: 'monitoring' | 'preparing' | 'surplus_confirmed' | 'rescued';
}

export interface NgoRecipient {
  id: string;
  name: string;
  type: 'Shelter' | 'Community Kitchen' | 'Orphanage' | 'Elderly Care' | 'Slum Welfare' | 'Night Shelter';
  location: LocationCoordinates;
  currentCapacity: number; // people to feed
  urgencyNeed: UrgencyLevel;
  preferredCategories: FoodCategory[];
  dietaryPreferences: string[];
  contactPerson: string;
  phone: string;
  operatingHours: string;
  reliabilityScore: number; // 0-100
  totalMealsReceived: number;
  verified: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  vehicleType: 'Walking' | 'Bicycle' | 'Scooter' | 'Car' | 'EV Van';
  capacityKg: number;
  isAvailable: boolean;
  currentLocation: LocationCoordinates;
  completedRescues: number;
  reliabilityScore: number; // 0-100
  impactPoints: number;
  activeRescueId?: string;
}

export interface MatchScore {
  ngoId: string;
  ngoName: string;
  overallScore: number; // 0-100
  distanceKm: number;
  etaMinutes: number;
  canServeCount: number;
  breakdown: {
    distanceFactor: number; // 40% weight
    requirementFit: number; // 25% weight
    pickupAvailability: number; // 15% weight
    urgencyPriority: number; // 10% weight
    reliabilityRating: number; // 10% weight
  };
  reasoning: string;
}

export interface RouteStop {
  id: string;
  order: number;
  type: 'pickup' | 'delivery';
  locationName: string;
  address: string;
  coords: { lat: number; lng: number };
  mealsCount: number;
  estimatedTime: string;
  completed: boolean;
}

export interface RescueRoute {
  id: string;
  title: string;
  volunteerId: string;
  volunteerName: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedDurationMin: number;
  totalMealsRescued: number;
  co2SavedKg: number;
  status: 'Optimized' | 'In Progress' | 'Completed';
  currentProgressPercent: number;
}

export interface PassportMilestone {
  stage: 'Prepared' | 'Listed' | 'Matched' | 'Picked Up' | 'Delivered';
  timestamp: string;
  location: string;
  actor: string;
  role: string;
  verifiedHash: string;
  notes?: string;
  temperatureCelsius?: number;
}

export interface FoodPassport {
  passportId: string;
  listingId: string;
  foodName: string;
  category: FoodCategory;
  donorName: string;
  recipientName: string;
  volunteerName: string;
  servings: number;
  weightKg: number;
  co2AvoidedKg: number;
  batchHash: string;
  qrPayload: string;
  milestones: PassportMilestone[];
  completed: boolean;
}

export interface ImpactStats {
  mealsRescued: number;
  foodSavedKg: number;
  co2AvoidedKg: number;
  peopleServed: number;
  economicValueInr: number;
  activeRescuesCount: number;
  rescueSuccessRate: number;
}

export interface SystemNotification {
  id: string;
  type: 'prediction' | 'emergency' | 'match' | 'volunteer' | 'delivery' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}
