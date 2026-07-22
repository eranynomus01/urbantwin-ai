'use client';
import React, { useState } from 'react';
import { EmergencyReport, ReliefCenter, VolunteerProfile } from '@/types';
import { Shield, AlertTriangle, Users, Sparkles, Filter, Download } from 'lucide-react';

interface OfficerDashboardProps {
  emergencies: EmergencyReport[];
  reliefCenters: ReliefCenter[];
  volunteers: VolunteerProfile[];
  onStatusUpdate: (id: number, status: string, team: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  emergencies,
  volunteers,
  onStatusUpdate
}) => {
  const [selectedTeam, setSelectedTeam] = useState<{ [id: number]: string }>({});
  const [filterDisaster, setFilterDisaster] = useState('All');

  const teams = [
    'NDRF Amphibious Rescue Battalion #3',
    'Delhi Fire Services Squad 2',
    '102 Paramedic ICU Ambulance',
    'Civil Defense Task Force',
    'PWD Structural Inspection Unit'
  ];

  const filteredEmergencies = emergencies.filter(
    (e) => filterDisaster === 'All' || e.disaster_type === filterDisaster
  );

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> District Emergency Command Center
          </div>
          <h2 className="text-2xl font-extrabold">Dr. Vikram Singh (District Magistrate / Officer)</h2>
          <p className="text-sm text-amber-100 mt-1">
            Central Dispatch Command • Zone 4 Operations • Active Helplines: 112 / 1070
          </p>
        </div>

        <button
          onClick={() => alert("Generating & Downloading Official Incident Audit Report (PDF/CSV)...")}
          className="px-4 py-2.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-amber-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-amber-600" /> Export Incident Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Live Emergency SOS Feed
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterDisaster}
                onChange={(e) => setFilterDisaster(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium px-3 py-1.5 rounded-xl"
              >
                <option value="All">All Disasters</option>
                <option value="Flood">Flood</option>
                <option value="Fire">Fire</option>
                <option value="Medical Emergency">Medical</option>
                <option value="Earthquake">Earthquake</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEmergencies.map((e) => (
              <div key={e.id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      AI Severity: {e.ai_severity}/10
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {e.disaster_type} @ {e.location_name}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    Status: {e.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{e.description}</p>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <div><strong>AI Recommended Dispatch:</strong> {e.ai_recommended_team}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <select
                    value={selectedTeam[e.id] || teams[0]}
                    onChange={(evt) => setSelectedTeam({ ...selectedTeam, [e.id]: evt.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl text-slate-900 dark:text-white"
                  >
                    {teams.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => onStatusUpdate(e.id, 'In Progress', selectedTeam[e.id] || teams[0])}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Assign & Dispatch
                  </button>

                  <button
                    onClick={() => onStatusUpdate(e.id, 'Resolved', e.assigned_team || 'NDRF')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Pending Volunteer Verifications
            </h3>
            <div className="space-y-3">
              {volunteers.map((v) => (
                <div key={v.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{v.name || `Volunteer #${v.id}`}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-500">{v.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Skills: {v.skills.join(', ')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => alert(`Volunteer #${v.id} Verified!`)} className="flex-1 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg">Approve</button>
                    <button onClick={() => alert(`Volunteer #${v.id} Rejected`)} className="px-2 py-1 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded-lg">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
