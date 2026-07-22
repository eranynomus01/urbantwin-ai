'use client';
import React, { useEffect, useState } from 'react';
import { EmergencyReport, ReliefCenter } from '@/types';
import { AlertTriangle, Home, Layers } from 'lucide-react';

interface LiveMapProps {
  emergencies: EmergencyReport[];
  reliefCenters: ReliefCenter[];
}

export const LiveMap: React.FC<LiveMapProps> = ({ emergencies, reliefCenters }) => {
  const [filter, setFilter] = useState<'all' | 'sos' | 'shelters'>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      });
    }
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
      {/* Map Control Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-lg text-xs font-semibold">
        <span className="flex items-center gap-1 text-slate-400 px-1">
          <Layers className="w-4 h-4 text-blue-400" /> Map Layers:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          All Markers
        </button>
        <button
          onClick={() => setFilter('sos')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${filter === 'sos' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Live SOS ({emergencies.length})
        </button>
        <button
          onClick={() => setFilter('shelters')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${filter === 'shelters' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
        >
          <Home className="w-3.5 h-3.5" /> Relief Centers ({reliefCenters.length})
        </button>
      </div>

      {/* Interactive Map Grid Canvas */}
      <div className="w-full h-full bg-slate-950 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
        <div className="absolute w-96 h-96 border-2 border-dashed border-emerald-500/40 rounded-full animate-ping pointer-events-none"></div>

        {/* Interactive SOS Pins */}
        {(filter === 'all' || filter === 'sos') &&
          emergencies.map((e, idx) => (
            <div
              key={`sos-${e.id}`}
              onClick={() => setSelectedItem({ type: 'SOS Emergency', ...e })}
              style={{
                top: `${35 + (idx % 3) * 18}%`,
                left: `${30 + (idx * 22) % 55}%`
              }}
              className="absolute z-30 cursor-pointer group"
            >
              <div className="relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <div className="relative px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-full shadow-lg border border-red-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> SOS #{e.id}
                </div>
              </div>
            </div>
          ))}

        {/* Interactive Relief Center Pins */}
        {(filter === 'all' || filter === 'shelters') &&
          reliefCenters.map((rc, idx) => (
            <div
              key={`shelter-${rc.id}`}
              onClick={() => setSelectedItem({ type: 'Relief Center Shelter', ...rc })}
              style={{
                top: `${25 + idx * 25}%`,
                left: `${20 + idx * 30}%`
              }}
              className="absolute z-30 cursor-pointer group"
            >
              <div className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-full shadow-lg border border-emerald-300 flex items-center gap-1">
                <Home className="w-3 h-3" /> {rc.name}
              </div>
            </div>
          ))}

        {/* Selected Popup Details */}
        {selectedItem && (
          <div className="absolute bottom-6 left-6 z-40 w-80 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {selectedItem.type}
              </span>
              <button onClick={() => setSelectedItem(null)} className="text-xs text-slate-400 hover:text-white">
                Close ✕
              </button>
            </div>
            <h4 className="font-bold text-sm text-white mb-1">
              {selectedItem.name || selectedItem.disaster_type}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-2 mb-2">
              {selectedItem.description || selectedItem.location_name}
            </p>
            {selectedItem.ai_severity && (
              <div className="text-xs font-semibold text-rose-400 mb-1">
                AI Severity Score: {selectedItem.ai_severity} / 10
              </div>
            )}
            {selectedItem.available_beds && (
              <div className="text-xs font-semibold text-emerald-400 mb-1">
                Available Beds: {selectedItem.available_beds} / {selectedItem.capacity}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
