
import { Bin, RouteMetrics, RouteMode } from '../types';
import { FUEL_CONSUMPTION_L_KM, TRUCK_SPEED_KMH, TIME_PER_BIN_MIN } from '../constants';

// Haversine formula for distance in KM
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getRoutePath = (bins: Bin[], mode: RouteMode, depot: { lat: number; lng: number }): Bin[] => {
  if (mode === RouteMode.FIXED) {
    // Return all bins in original order
    return bins;
  }

  // Optimized: Filter bins > 70% level and use Greedy Nearest Neighbor
  let candidates = bins.filter(b => b.level >= 70);
  const path: Bin[] = [];
  let currentPos = depot;

  while (candidates.length > 0) {
    let nearestIndex = 0;
    let minDistance = calculateDistance(currentPos.lat, currentPos.lng, candidates[0].lat, candidates[0].lng);

    for (let i = 1; i < candidates.length; i++) {
      const d = calculateDistance(currentPos.lat, currentPos.lng, candidates[i].lat, candidates[i].lng);
      if (d < minDistance) {
        minDistance = d;
        nearestIndex = i;
      }
    }

    const nextBin = candidates.splice(nearestIndex, 1)[0];
    path.push(nextBin);
    currentPos = { lat: nextBin.lat, lng: nextBin.lng };
  }

  return path;
};

export const calculateMetrics = (path: Bin[], depot: { lat: number, lng: number }): RouteMetrics => {
  if (path.length === 0) return { distance: 0, fuel: 0, time: 0, binsCollected: 0 };

  let totalDist = 0;
  let currentPos = depot;

  path.forEach(bin => {
    totalDist += calculateDistance(currentPos.lat, currentPos.lng, bin.lat, bin.lng);
    currentPos = { lat: bin.lat, lng: bin.lng };
  });

  // Return to depot
  totalDist += calculateDistance(currentPos.lat, currentPos.lng, depot.lat, depot.lng);

  const fuel = totalDist * FUEL_CONSUMPTION_L_KM;
  const driveTime = (totalDist / TRUCK_SPEED_KMH) * 60;
  const collectionTime = path.length * TIME_PER_BIN_MIN;

  return {
    distance: Number(totalDist.toFixed(2)),
    fuel: Number(fuel.toFixed(2)),
    time: Math.round(driveTime + collectionTime),
    binsCollected: path.length
  };
};
