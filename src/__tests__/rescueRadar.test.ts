import { describe, it, expect } from 'vitest';
import { INITIAL_PREDICTIONS, INITIAL_LISTINGS, INITIAL_ROUTE } from '../data/mockData';

describe('Food Rescue Radar & Surplus Forecasting Workflows', () => {
  it('correctly provides predictions across all timeframe filters including Next 1h', () => {
    const next1h = INITIAL_PREDICTIONS.filter((p) => p.timeframeCategory === 'Next 1h');
    const next3h = INITIAL_PREDICTIONS.filter((p) => p.timeframeCategory === 'Next 3h');
    const tonight = INITIAL_PREDICTIONS.filter((p) => p.timeframeCategory === 'Tonight');
    const tomorrow = INITIAL_PREDICTIONS.filter((p) => p.timeframeCategory === 'Tomorrow');

    expect(next1h.length).toBeGreaterThan(0);
    expect(next3h.length).toBeGreaterThan(0);
    expect(tonight.length).toBeGreaterThan(0);
    expect(tomorrow.length).toBeGreaterThan(0);

    // Verify prediction data schema integrity
    next1h.forEach((pred) => {
      expect(pred.id).toBeDefined();
      expect(pred.probability).toBeGreaterThan(50);
      expect(pred.estimatedServingsMin).toBeGreaterThan(0);
      expect(pred.estimatedServingsMax).toBeGreaterThanOrEqual(pred.estimatedServingsMin);
      expect(pred.location.lat).toBeGreaterThan(18);
      expect(pred.location.lng).toBeGreaterThan(72);
    });
  });

  it('validates food listing lifecycle progression', () => {
    const listing = INITIAL_LISTINGS[0];
    expect(listing.status).toBe('Available');

    // Simulate claiming
    const claimedListing = { ...listing, status: 'Claimed' as const, claimedBy: 'ngo-1', claimedAt: new Date().toISOString() };
    expect(claimedListing.status).toBe('Claimed');
    expect(claimedListing.claimedBy).toBe('ngo-1');

    // Simulate volunteer pickup
    const pickedUpListing = { ...claimedListing, status: 'Picked Up' as const };
    expect(pickedUpListing.status).toBe('Picked Up');

    // Simulate delivery
    const deliveredListing = { ...pickedUpListing, status: 'Delivered' as const };
    expect(deliveredListing.status).toBe('Delivered');
  });

  it('validates multi-donor route waypoints and reordering logic', () => {
    const route = INITIAL_ROUTE;
    expect(route.stops.length).toBeGreaterThan(1);
    expect(route.totalDistanceKm).toBeGreaterThan(0);
    expect(route.estimatedDurationMin).toBeGreaterThan(0);

    // Verify initial ordering is sequential
    const orders = route.stops.map((s) => s.order);
    expect(orders).toEqual([1, 2, 3, 4]);

    // Test reorder swap
    const reordered = [...route.stops];
    const [moved] = reordered.splice(0, 1);
    reordered.splice(1, 0, moved);
    const updated = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));

    expect(updated[0].id).toBe(route.stops[1].id);
    expect(updated[1].id).toBe(route.stops[0].id);
  });
});
