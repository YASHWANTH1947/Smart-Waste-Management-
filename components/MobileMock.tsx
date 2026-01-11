
import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { Bin } from '../types';

interface Props {
  activeBin?: Bin;
}

const MobileMock: React.FC<Props> = ({ activeBin }) => {
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden shrink-0 hidden lg:block">
      {/* Speaker/Sensors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-xl z-20"></div>
      
      {/* Screen Content */}
      <div className="relative h-full bg-white flex flex-col p-6 pt-12">
        {/* App Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-xl font-black text-emerald-600">EcoDriver</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pitampura Sector 04</p>
          </div>
          <RefreshCw size={18} className="text-gray-400" />
        </div>

        {/* Status Card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Current Target</p>
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <MapPin size={20} />
            </div>
            <div>
              <h5 className="font-bold text-gray-800 leading-tight">
                {activeBin ? activeBin.id : 'No target set'}
              </h5>
              <p className="text-[11px] text-gray-500">Distance: 120m away</p>
            </div>
          </div>
        </div>

        {/* Task Section */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h6 className="font-bold text-gray-800">Job Checklist</h6>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">1 Task Left</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
              <input type="checkbox" className="w-4 h-4 rounded text-emerald-500" readOnly checked={reported} />
              <span className="text-xs font-medium text-gray-600">Arrive at location</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
              <Camera size={16} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600">Capture verification photo</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={handleReport}
              disabled={reported}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                reported 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600'
              }`}
            >
              {reported ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {reported ? 'Completed' : 'Clear Bin & Verify'}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default MobileMock;
