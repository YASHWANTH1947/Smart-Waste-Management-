
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Bin, RouteMode } from '../types';
import { PITAMPURA_CENTER } from '../constants';

interface Props {
  bins: Bin[];
  routePath: Bin[];
  mode: RouteMode;
  onBinClick: (bin: Bin) => void;
}

const MapContainer: React.FC<Props> = ({ bins, routePath, mode, onBinClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(PITAMPURA_CENTER, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    markersGroupRef.current = L.layerGroup().addTo(mapRef.current);
    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers and Polyline
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // Bin Markers - Rendered as static circles
    bins.forEach(bin => {
      const color = bin.level > 85 ? '#ef4444' : bin.level > 50 ? '#f59e0b' : '#10b981';
      L.circleMarker([bin.lat, bin.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
      .bindPopup(`<b>${bin.id}</b><br/>Fill Level: ${bin.level}%`)
      .on('click', () => onBinClick(bin))
      .addTo(markersGroupRef.current!);
    });

    // Depot Marker
    L.marker(PITAMPURA_CENTER, {
      icon: L.divIcon({
        className: 'bg-gray-800 rounded-lg p-1 text-white shadow-xl',
        html: '<div class="text-[10px] font-bold px-1 uppercase whitespace-nowrap">Central Depot</div>',
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      })
    }).addTo(markersGroupRef.current);

    // Route Polyline - Updated based on selected mode
    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    const pathCoords: [number, number][] = [
      PITAMPURA_CENTER,
      ...routePath.map(b => [b.lat, b.lng] as [number, number]),
      PITAMPURA_CENTER
    ];

    polylineRef.current = L.polyline(pathCoords, {
      color: mode === RouteMode.OPTIMIZED ? '#10b981' : '#6366f1',
      weight: 4,
      opacity: 0.7,
      dashArray: mode === RouteMode.FIXED ? '10, 10' : undefined
    }).addTo(mapRef.current);

  }, [bins, routePath, mode, onBinClick]);

  return (
    <div className="relative flex-1 bg-gray-200">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg pointer-events-none">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Map Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-gray-600 font-medium">&lt; 50% Clear</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-[10px] text-gray-600 font-medium">50% - 85% Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-[10px] text-gray-600 font-medium">&gt; 85% Critical</span>
          </div>
          <div className="pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-1 ${mode === RouteMode.OPTIMIZED ? 'bg-emerald-500' : 'bg-indigo-500 border-t border-dashed'}`}></div>
              <span className="text-[10px] text-gray-600 font-bold uppercase">{mode} Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
