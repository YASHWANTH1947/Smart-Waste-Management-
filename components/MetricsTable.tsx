
import React from 'react';
import { RouteMetrics } from '../types';
import { TrendingDown, TrendingUp, Fuel, Clock, Map as MapIcon, Trash2 } from 'lucide-react';

interface Props {
  fixed: RouteMetrics;
  optimized: RouteMetrics;
}

const MetricsTable: React.FC<Props> = ({ fixed, optimized }) => {
  const calculateGain = (f: number, o: number) => {
    if (f === 0) return 0;
    return (((f - o) / f) * 100).toFixed(1);
  };

  const metrics = [
    { label: 'Distance', icon: <MapIcon size={16}/>, fixed: `${fixed.distance} km`, opt: `${optimized.distance} km`, gain: calculateGain(fixed.distance, optimized.distance), unit: '%' },
    { label: 'Fuel', icon: <Fuel size={16}/>, fixed: `${fixed.fuel} L`, opt: `${optimized.fuel} L`, gain: calculateGain(fixed.fuel, optimized.fuel), unit: '%' },
    { label: 'Time', icon: <Clock size={16}/>, fixed: `${fixed.time} m`, opt: `${optimized.time} m`, gain: calculateGain(fixed.time, optimized.time), unit: '%' },
    { label: 'Bins Picked', icon: <Trash2 size={16}/>, fixed: fixed.binsCollected, opt: optimized.binsCollected, gain: '-', unit: '' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingDown className="text-emerald-500" /> Efficiency Analysis
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 font-medium">
              <th className="pb-3 px-2">Metric</th>
              <th className="pb-3 px-2">Fixed</th>
              <th className="pb-3 px-2">Optimized</th>
              <th className="pb-3 px-2 text-emerald-600">Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {metrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2 flex items-center gap-2 font-medium text-gray-700">
                  {m.icon} {m.label}
                </td>
                <td className="py-4 px-2 text-gray-600">{m.fixed}</td>
                <td className="py-4 px-2 font-bold text-gray-900">{m.opt}</td>
                <td className="py-4 px-2 text-emerald-600 font-bold">
                  {m.gain !== '-' ? (
                    <span className="flex items-center gap-1">
                      <TrendingDown size={14} /> {m.gain}{m.unit}
                    </span>
                  ) : m.gain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
        <p className="text-xs text-emerald-800 font-medium">
          Note: Optimized route ignores bins with &lt;70% fill level to reduce unnecessary pickups and fuel waste.
        </p>
      </div>
    </div>
  );
};

export default MetricsTable;
