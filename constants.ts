
import { Bin } from './types';

export const PITAMPURA_CENTER: [number, number] = [28.6949, 77.1350];

// Generate 20 mock bins around Pitampura
const generateMockBins = (): Bin[] => {
  const bins: Bin[] = [];
  const baseLat = 28.6949;
  const baseLng = 77.1350;
  
  for (let i = 1; i <= 20; i++) {
    bins.push({
      id: `BIN-${i.toString().padStart(3, '0')}`,
      lat: baseLat + (Math.random() - 0.5) * 0.02,
      lng: baseLng + (Math.random() - 0.5) * 0.02,
      level: Math.floor(Math.random() * 100),
      lastUpdate: new Date().toISOString()
    });
  }
  return bins;
};

export const INITIAL_BINS = generateMockBins();

export const TRUCK_SPEED_KMH = 20;
export const FUEL_CONSUMPTION_L_KM = 0.4; // 2.5km/L for a heavy garbage truck
export const TIME_PER_BIN_MIN = 5;
