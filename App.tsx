
import React, { useState, useMemo, useCallback } from 'react';
import { Bin, RouteMode, RouteMetrics } from './types';
import { INITIAL_BINS, PITAMPURA_CENTER } from './constants';
import { getRoutePath, calculateMetrics } from './services/routingService';
import MapContainer from './components/MapContainer';
import MetricsTable from './components/MetricsTable';
import { Trash2, ShieldCheck, Map as MapIcon, Upload, Info, RefreshCw, User } from 'lucide-react';

const App: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
  const [mode, setMode] = useState<RouteMode>(RouteMode.OPTIMIZED);
  const [selectedBin, setSelectedBin] = useState<Bin | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  // Memoize routes and metrics for performance
  const routes = useMemo(() => {
    const fixedPath = getRoutePath(bins, RouteMode.FIXED, { lat: PITAMPURA_CENTER[0], lng: PITAMPURA_CENTER[1] });
    const optPath = getRoutePath(bins, RouteMode.OPTIMIZED, { lat: PITAMPURA_CENTER[0], lng: PITAMPURA_CENTER[1] });
    
    return {
      fixed: fixedPath,
      optimized: optPath,
      active: mode === RouteMode.OPTIMIZED ? optPath : fixedPath
    };
  }, [bins, mode]);

  const metrics = useMemo(() => ({
    fixed: calculateMetrics(routes.fixed, { lat: PITAMPURA_CENTER[0], lng: PITAMPURA_CENTER[1] }),
    optimized: calculateMetrics(routes.optimized, { lat: PITAMPURA_CENTER[0], lng: PITAMPURA_CENTER[1] })
  }), [routes]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setBins(json);
        }
      } catch (err) {
        alert('Invalid JSON file format');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const regenerateData = () => {
    const newBins = bins.map(b => ({
      ...b,
      level: Math.floor(Math.random() * 100),
      lastUpdate: new Date().toISOString()
    }));
    setBins(newBins);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar Controls */}
      <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 bg-emerald-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Trash2 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight">EcoRoute Pro</h1>
          </div>
          <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest opacity-80">
            Smart Waste Management System
          </p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Mode Switcher */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Route Optimization Mode</label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button 
                onClick={() => setMode(RouteMode.FIXED)}
                className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  mode === RouteMode.FIXED 
                  ? 'bg-white shadow-md text-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <RefreshCw size={16} /> Fixed
              </button>
              <button 
                onClick={() => setMode(RouteMode.OPTIMIZED)}
                className={`py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  mode === RouteMode.OPTIMIZED 
                  ? 'bg-emerald-500 shadow-md text-white' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShieldCheck size={16} /> Optimized
              </button>
            </div>
          </div>

          {/* Metrics Visualization */}
          <MetricsTable fixed={metrics.fixed} optimized={metrics.optimized} />

          {/* Data Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Upload size={16} className="text-gray-400" /> Data Management
            </h4>
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer bg-white border border-dashed border-gray-300 rounded-xl py-4 px-3 text-center hover:border-emerald-500 transition-colors group">
                <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                <span className="text-xs text-gray-500 font-medium group-hover:text-emerald-600">Upload Bin Data (.json)</span>
              </label>
              <button 
                onClick={regenerateData}
                className="bg-gray-100 hover:bg-gray-200 p-4 rounded-xl text-gray-600 transition-colors"
                title="Regenerate random levels"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <div className="bg-emerald-50 p-1.5 rounded-lg">
              <User size={18} className="text-emerald-600 shrink-0" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-700 leading-tight">Project Developer</p>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase">KR YASHWANTH REDDY</p>
              <div className="mt-2 pt-2 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Project Purpose</p>
                <p className="text-[10px] text-gray-500 italic">Optimizing urban hygiene through AI-driven logistics and sensor-based real-time analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <MapIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Pitampura Smart Zone</h2>
              <p className="text-xs text-gray-500">Live Coverage: 20 Active Sensors</p>
            </div>
          </div>
        </header>

        <MapContainer 
          bins={bins} 
          routePath={routes.active} 
          mode={mode} 
          onBinClick={setSelectedBin}
        />
      </main>
    </div>
  );
};

export default App;
