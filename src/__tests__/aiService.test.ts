import { describe, it, expect } from 'vitest';
import { calculateSmartMatches, analyzeFoodItemWithAI } from '../services/aiService';
import { FoodListing, NgoRecipient } from '../types';

describe('AI Service & Smart Matching Logic', () => {
  const sampleListing: FoodListing = {
    id: 'lst-test-1',
    passportId: 'FRR-TEST-001',
    title: 'Warm Vegetable Biryani & Raita',
    donorId: 'dnr-1',
    donorName: 'Spice Palace',
    donorType: 'Restaurant',
    category: 'Prepared Meal',
    items: ['Vegetable Biryani 20kg', 'Boondi Raita 5L'],
    servings: 50,
    weightKg: 25,
    preparedAt: new Date().toISOString(),
    urgency: 'High',
    currentRadiusKm: 2,
    location: {
      lat: 19.076,
      lng: 72.877,
      address: 'Bandra West',
      city: 'Mumbai',
    },
    safety: {
      score: 95,
      status: 'Good for rescue',
      prepTimeAgoMinutes: 30,
      temperatureCelsius: 65,
      storageCondition: 'Hot Holding (>60°C)',
      packagingType: 'Sealed Containers',
      allergens: ['Dairy'],
      dietary: ['Vegetarian'],
      verifiedByAi: true,
      notes: 'Pristine temperature retention.',
    },
    status: 'Available',
    isEmergencyAlert: false,
    expiryAt: new Date(Date.now() + 3600000).toISOString(),
    pickupWindowStart: new Date().toISOString(),
    pickupWindowEnd: new Date(Date.now() + 3600000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    createdAt: new Date().toISOString(),
  };

  const sampleNgos: NgoRecipient[] = [
    {
      id: 'ngo-test-1',
      name: 'Bandra Youth Shelter',
      type: 'Shelter',
      currentCapacity: 60,
      urgencyNeed: 'High',
      preferredCategories: ['Prepared Meal'],
      dietaryPreferences: ['Vegetarian', 'Halal'],
      location: {
        lat: 19.078,
        lng: 72.879,
        address: 'Bandra Station Road',
        city: 'Mumbai',
      },
      contactPerson: 'Zoya Khan',
      phone: '+91 98200 11111',
      operatingHours: '6:00 AM – 11:00 PM',
      reliabilityScore: 98,
      totalMealsReceived: 2100,
      verified: true,
    },
    {
      id: 'ngo-test-2',
      name: 'Distant Community Kitchen',
      type: 'Community Kitchen',
      currentCapacity: 30,
      urgencyNeed: 'Medium',
      preferredCategories: ['Prepared Meal'],
      dietaryPreferences: ['Vegetarian'],
      location: {
        lat: 19.140,
        lng: 72.930,
        address: 'Thane Highway',
        city: 'Mumbai',
      },
      contactPerson: 'Ramesh Patil',
      phone: '+91 98300 22222',
      operatingHours: '9:00 AM – 8:00 PM',
      reliabilityScore: 90,
      totalMealsReceived: 850,
      verified: true,
    },
  ];

  it('calculates smart match scores and ranks nearby recipients higher', () => {
    const matches = calculateSmartMatches(sampleListing, sampleNgos);

    expect(matches).toBeDefined();
    expect(matches.length).toBe(2);

    const firstMatch = matches[0];
    const secondMatch = matches[1];

    // Bandra Youth Shelter is much closer (less than 1km) so it should rank higher
    expect(firstMatch.ngoId).toBe('ngo-test-1');
    expect(firstMatch.overallScore).toBeGreaterThan(secondMatch.overallScore);
    expect(firstMatch.distanceKm).toBeLessThan(secondMatch.distanceKm);
    expect(firstMatch.breakdown.distanceFactor).toBeGreaterThan(secondMatch.breakdown.distanceFactor);
  });

  it('evaluates food safety analysis with safe fallbacks if offline', async () => {
    const analysis = await analyzeFoodItemWithAI({
      title: 'Warm Vegetable Biryani & Raita',
      category: 'Prepared Meal',
      servings: 50,
      storageCondition: 'Hot Holding (>60°C)',
      preparedMinutesAgo: 30,
    });

    expect(analysis).toBeDefined();
    expect(analysis.safetyScore).toBeGreaterThanOrEqual(0);
    expect(analysis.safetyScore).toBeLessThanOrEqual(100);
    expect(analysis.safetyStatus).toBeDefined();
    expect(Array.isArray(analysis.detectedItems)).toBe(true);
    expect(analysis.detectedItems.length).toBeGreaterThan(0);
  });
});
