'use client';
import React, { useState } from 'react';
import { EmergencyReport } from '@/types';
import { HeartHandshake, CheckCircle2, Award, MapPin, Navigation, ShieldCheck, Download } from 'lucide-react';

interface VolunteerDashboardProps {
  emergencies: EmergencyReport[];
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ emergencies }) => {
  const [missionsCompleted, setMissionsCompleted] = useState(18);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleMissionCheckin = () => {
    setMissionsCompleted((prev) => prev + 1);
    setCheckedIn(true);
    alert("Mission check-in recorded! Performance score updated (+0.1).");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" /> Registered Disaster Volunteer Force
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold">Priya Patel</h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-400 text-slate-950 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED VOLUNTEER
            </span>
          </div>
          <p className="text-sm text-emerald-100 mt-1">
            Skills: First Aid Paramedic, Amphibious Rescue, Utility Driving • District Unit #4
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
          <div>
            <span className="block text-[11px] text-emerald-200 uppercase font-semibold">Missions</span>
            <span className="text-xl font-black">{missionsCompleted}</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="block text-[11px] text-emerald-200 uppercase font-semibold">Rating</span>
            <span className="text-xl font-black text-amber-300">4.9 / 5.0</span>
          </div>
          <button
            onClick={() => alert("Downloading Official Digital Volunteering Certificate (PDF)...")}
            className="p-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md"
          >
            <Download className="w-4 h-4" /> Certificate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-500" /> Active Rescue Missions Nearby
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Within 10 km Radius</span>
          </div>

          <div className="space-y-4">
            {emergencies.map((e) => (
              <div key={e.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 mr-2">
                      {e.disaster_type}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base inline">{e.location_name}</h4>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold rounded-full">
                    ● {e.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{e.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-emerald-500" /> 1.8 km from your GPS
                  </div>
                  <button
                    onClick={handleMissionCheckin}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {checkedIn ? 'Check-in Recorded' : 'Check-in Attendance'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Volunteer Kit & Readiness
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> High-Visibility Safety Jacket</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Level-2 Paramedic First Aid Bag</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Walkie-Talkie (433MHz)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Emergency Whistle & Flashlight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
