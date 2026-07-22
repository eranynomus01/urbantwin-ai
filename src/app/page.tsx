'use client';
import React, { useState, useEffect } from 'react';
import { UserRole, EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile } from '@/types';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LiveMap } from '@/components/LiveMap';
import { AIChatbot } from '@/components/AIChatbot';
import { ReportEmergencyModal } from '@/components/ReportEmergencyModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { CitizenDashboard } from '@/components/CitizenDashboard';
import { VolunteerDashboard } from '@/components/VolunteerDashboard';
import { OfficerDashboard } from '@/components/OfficerDashboard';
import { NGODashboard } from '@/components/NGODashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import {
  ShieldAlert,
  AlertTriangle,
  HeartHandshake,
  Home as HomeIcon,
  Waves,
  Flame,
  Mountain,
  Zap,
  SunMedium,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [darkMode, setDarkMode] = useState(true);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [reliefCenters, setReliefCenters] = useState<ReliefCenter[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [stats, setStats] = useState({
    total_emergencies: 57,
    active_volunteers: 142,
    relief_centers: 18,
    people_rescued: 482,
    resources_delivered: 12500
  });

  useEffect(() => {
    api.getReports().then(setEmergencies);
    api.getReliefCenters().then(setReliefCenters);
    api.getResources().then(setResources);
    api.getVolunteers().then(setVolunteers);
    api.getStats().then((s: any) => setStats(s));
  }, []);

  const handleStatusUpdate = async (id: number, status: string, team: string) => {
    await api.updateReportStatus(id, status, team);
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: status as any, assigned_team: team } : e))
    );
  };

  const disasterTypes = [
    { name: 'Flood', icon: <Waves className="w-6 h-6 text-blue-400" />, desc: 'Amphibious rescue & water supply' },
    { name: 'Fire', icon: <Flame className="w-6 h-6 text-rose-500" />, desc: 'Hazmat & smoke evacuation' },
    { name: 'Earthquake', icon: <Mountain className="w-6 h-6 text-amber-500" />, desc: 'Debris search & structural triage' },
    { name: 'Cyclone', icon: <Zap className="w-6 h-6 text-sky-400" />, desc: 'Storm shelter & fallen tree clearing' },
    { name: 'Heatwave', icon: <SunMedium className="w-6 h-6 text-yellow-500" />, desc: 'Mobile cooling centers & IV oxygen' },
    { name: 'Landslide', icon: <ShieldAlert className="w-6 h-6 text-emerald-500" />, desc: 'Geological safety clearing' },
    { name: 'Medical', icon: <Stethoscope className="w-6 h-6 text-red-400" />, desc: 'ACLS ambulance & field doctors' },
  ];

  return (
    <div className={darkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-900 min-h-screen'}>
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-900/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" /> Next-Gen AI Emergency Management Platform
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              AI Powered <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Disaster Emergency</span> Response Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Empowering Citizens, NDRF Rescue Teams, District Magistrates, and NGOs to coordinate seamlessly during floods, cyclones, fires, earthquakes, and medical crises.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsSOSOpen(true)}
                className="sos-glow px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2 transition-all scale-105"
              >
                <AlertTriangle className="w-5 h-5 animate-pulse" /> Report Emergency (SOS)
              </button>

              <button
                onClick={() => setCurrentRole('volunteer')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all"
              >
                <HeartHandshake className="w-5 h-5" /> Become Volunteer
              </button>

              <button
                onClick={() => {
                  const mapElem = document.getElementById('live-map-section');
                  if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5 text-blue-400" /> Find Relief Center
              </button>
            </div>
          </div>
        </section>

        {/* LIVE COUNTER STATISTICS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-3xl font-black text-blue-600 dark:text-blue-400">{stats.total_emergencies}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Total Emergencies</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-3xl font-black text-emerald-500">{stats.active_volunteers}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Active Volunteers</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-3xl font-black text-sky-400">{stats.relief_centers}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Relief Centers</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-3xl font-black text-rose-500">{stats.people_rescued}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">People Rescued</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center col-span-2 lg:col-span-1">
            <span className="block text-3xl font-black text-amber-400">{stats.resources_delivered.toLocaleString()}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Resources Delivered</span>
          </div>
        </section>

        {/* EMERGENCY TYPES GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-blue-500" /> Supported Emergency Response Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {disasterTypes.map((d) => (
              <div
                key={d.name}
                className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all text-center group cursor-pointer"
              >
                <div className="mx-auto w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {d.icon}
                </div>
                <h4 className="font-bold text-xs text-white mb-0.5">{d.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DYNAMIC ROLE DASHBOARD SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Interactive Portal Workspace</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                {currentRole} Command Dashboard
              </h2>
            </div>
          </div>

          {currentRole === 'citizen' && (
            <CitizenDashboard emergencies={emergencies} reliefCenters={reliefCenters} onOpenSOS={() => setIsSOSOpen(true)} />
          )}
          {currentRole === 'volunteer' && (
            <VolunteerDashboard emergencies={emergencies} />
          )}
          {currentRole === 'officer' && (
            <OfficerDashboard emergencies={emergencies} reliefCenters={reliefCenters} volunteers={volunteers} onStatusUpdate={handleStatusUpdate} />
          )}
          {currentRole === 'ngo' && (
            <NGODashboard resources={resources} />
          )}
          {currentRole === 'admin' && (
            <AdminDashboard />
          )}
        </section>

        {/* LIVE DISASTER MAP SECTION */}
        <section id="live-map-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Real-Time GIS Mapping</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Live Disaster Map & Safe Zones
              </h2>
            </div>
          </div>
          <LiveMap emergencies={emergencies} reliefCenters={reliefCenters} />
        </section>

        {/* 5-STEP HOW IT WORKS WORKFLOW */}
        <section className="p-8 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Response Lifecycle</span>
            <h2 className="text-2xl font-black text-white">How AI Disaster Portal Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black mx-auto text-sm">1</span>
              <h4 className="font-bold text-sm text-white">Report SOS</h4>
              <p className="text-xs text-slate-400">Citizen submits location, photo, & incident details.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-black mx-auto text-sm">2</span>
              <h4 className="font-bold text-sm text-white">AI Analysis</h4>
              <p className="text-xs text-slate-400">Gemini AI categorizes disaster & predicts severity (1-10).</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-black mx-auto text-sm">3</span>
              <h4 className="font-bold text-sm text-white">Officer Assign</h4>
              <p className="text-xs text-slate-400">District Command dispatches NDRF & Fire units.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black mx-auto text-sm">4</span>
              <h4 className="font-bold text-sm text-white">Rescue Action</h4>
              <p className="text-xs text-slate-400">Volunteers & NDRF execute mission on ground.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-black mx-auto text-sm">5</span>
              <h4 className="font-bold text-sm text-white">Resolution</h4>
              <p className="text-xs text-slate-400">Safe shelter arrival & certificate issuance.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ReportEmergencyModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <AIChatbot />
    </div>
  );
}
