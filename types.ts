
export interface Bin {
  id: string;
  lat: number;
  lng: number;
  level: number; // 0-100
  lastUpdate: string;
}

export interface RouteMetrics {
  distance: number; // km
  fuel: number; // liters
  time: number; // minutes
  binsCollected: number;
}

export enum RouteMode {
  FIXED = 'FIXED',
  OPTIMIZED = 'OPTIMIZED'
}

export interface WorkerReport {
  binId: string;
  status: 'CLEARED' | 'BLOCKED' | 'FULL';
  timestamp: string;
  imageUrl?: string;
}
