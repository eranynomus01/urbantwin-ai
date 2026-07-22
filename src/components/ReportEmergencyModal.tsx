'use client';
import React, { useState } from 'react';
import { DisasterType } from '@/types';
import { api } from '@/lib/api';
import { X, AlertTriangle, MapPin, Upload, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReportEmergencyModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [description, setDescription] = useState('');
  const [peopleAffected, setPeopleAffected] = useState<number>(1);
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [locationName, setLocationName] = useState('Sector 4 Flood Zone');
  const [lat, setLat] = useState<number>(28.6139);
  const [lng, setLng] = useState<number>(77.2090);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationName(`GPS: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          alert('GPS location set to default District Center coordinates.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.createReport({
        disaster_type: disasterType,
        description,
        people_affected: Number(peopleAffected),
        urgency,
        location_name: locationName,
        lat,
        lng,
        user_name: 'Citizen Emergency SOS'
      });

      setAiResult(res.ai_analysis || {
        severity: urgency === 'Critical' ? 9 : 7,
        category: `AI Triage - ${disasterType}`,
        recommended_team: "NDRF Mobile Response Team",
        summary: "Emergency report logged and dispatched."
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold">Report Disaster Emergency (SOS)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {aiResult ? (
          <div className="p-6 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Emergency SOS Logged!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Disaster Authority & NDRF units have been notified.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-left border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> AI Emergency Triage Analysis
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">AI Predicted Severity:</span>
                  <div className="text-lg font-black text-rose-600 dark:text-rose-400">{aiResult.severity} / 10</div>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Assigned Priority:</span>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400">{aiResult.priority_level || 'HIGH'}</div>
                </div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-xs">Recommended Response Unit:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{aiResult.recommended_team}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-xs">AI Incident Summary:</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">{aiResult.summary}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setAiResult(null);
                onClose();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg"
            >
              Done & Track SOS Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Disaster Category
              </label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                <option value="Flood">🌊 Flood Emergency</option>
                <option value="Fire">🔥 Fire Outbreak</option>
                <option value="Earthquake">🌋 Earthquake Tremor</option>
                <option value="Cyclone">🌀 Cyclone / Storm Surge</option>
                <option value="Heatwave">☀️ Extreme Heatwave</option>
                <option value="Landslide">⛰️ Landslide Collapse</option>
                <option value="Medical Emergency">🚑 Medical Crisis</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  People Affected
                </label>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical (Immediate Rescue Needed)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Incident Location Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street, Landmark or Area..."
                  className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" /> GPS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Emergency Details / Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current condition, stranded people, medical needs..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center cursor-pointer hover:border-blue-500">
              <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Attach Disaster Photo / Video Evidence (Optional)
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> AI Triage & Submitting SOS...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5" /> SUBMIT SOS EMERGENCY ALERT
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
