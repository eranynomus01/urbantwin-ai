'use client';
import React, { useState, useEffect } from 'react';
import { UserRole, EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile, User } from '@/types';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LiveMap } from '@/components/LiveMap';
import { AIChatbot } from '@/components/AIChatbot';
import { ReportEmergencyModal } from '@/components/ReportEmergencyModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { AuthModal } from '@/components/AuthModal';
import { MobileBottomNav } from '@/components/MobileBottomNav';
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
  Sparkles,
  Lock
} from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [emergencies, setEmergencies] = useState<EmergencyReport[]>([]);
  const [reliefCenters, setReliefCenters] = useState<ReliefCenter[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [stats, setStats] = useState({
    total_emergencies: 0,
    active_volunteers: 0,
    relief_centers: 0,
    people_rescued: 0,
    resources_delivered: 0
  });

  const loadPortalData = () => {
    api.getReports().then(setEmergencies);
    api.getReliefCenters().then(setReliefCenters);
    api.getResources().then(setResources);
    api.getVolunteers().then(setVolunteers);
    api.getStats().then((s: any) => setStats(s));
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleStatusUpdate = async (id: number, status: string, team: string) => {
    await api.updateReportStatus(id, status, team);
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: status as any, assigned_team: team } : e))
    );
  };

  const disasterTypes = [
    { name: 'Flood', icon: <Waves className="w-5 h-5 text-blue-400" />, desc: 'Amphibious rescue' },
    { name: 'Fire', icon: <Flame className="w-5 h-5 text-rose-500" />, desc: 'Hazmat response' },
    { name: 'Earthquake', icon: <Mountain className="w-5 h-5 text-amber-500" />, desc: 'Debris search' },
    { name: 'Cyclone', icon: <Zap className="w-5 h-5 text-sky-400" />, desc: 'Storm shelter' },
    { name: 'Heatwave', icon: <SunMedium className="w-5 h-5 text-yellow-500" />, desc: 'Cooling & oxygen' },
    { name: 'Landslide', icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />, desc: 'Safety clearing' },
    { name: 'Medical', icon: <Stethoscope className="w-5 h-5 text-red-400" />, desc: 'ACLS ambulance' },
  ];

  return (
    <div className={darkMode ? 'dark bg-slate-950 text-slate-100 min-h-screen pb-16 md:pb-0' : 'bg-slate-50 text-slate-900 min-h-screen pb-16 md:pb-0'}>
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-10 md:space-y-16">
        {/* HERO SECTION */}
        <section className="relative rounded-3xl p-6 sm:p-12 overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 border border-blue-900/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> National AI Emergency Response Platform
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              AI Powered <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Disaster Emergency</span> Response Portal
            </h1>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Unified platform connecting Citizens, Rescue Volunteers, District Magistrates, and NGOs to coordinate during floods, fires, cyclones, earthquakes, and medical crises.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsSOSOpen(true)}
                className="sos-glow px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <AlertTriangle className="w-5 h-5 animate-pulse" /> Report Emergency (SOS)
              </button>

              <button
                onClick={() => {
                  setCurrentRole('volunteer');
                  setIsAuthOpen(true);
                }}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-5 h-5" /> Become Volunteer
              </button>

              <button
                onClick={() => {
                  const mapElem = document.getElementById('live-map-section');
                  if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-slate-800/80 border border-slate-700 text-slate-200 font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                <HomeIcon className="w-5 h-5 text-blue-400" /> Find Relief Center
              </button>
            </div>
          </div>
        </section>

        {/* LIVE COUNTER STATISTICS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{stats.total_emergencies}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Active SOS Reports</span>
          </div>
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-500">{stats.active_volunteers}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Verified Volunteers</span>
          </div>
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl sm:text-3xl font-black text-sky-400">{stats.relief_centers}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Relief Shelters</span>
          </div>
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="block text-2xl sm:text-3xl font-black text-rose-500">{stats.people_rescued}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">People Rescued</span>
          </div>
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center col-span-2 lg:col-span-1">
            <span className="block text-2xl sm:text-3xl font-black text-amber-400">{stats.resources_delivered.toLocaleString()}</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 block">Supplies Logged</span>
          </div>
        </section>

        {/* EMERGENCY TYPES GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" /> Emergency Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {disasterTypes.map((d) => (
              <div
                key={d.name}
                className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all text-center group cursor-pointer"
              >
                <div className="mx-auto w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  {d.icon}
                </div>
                <h4 className="font-bold text-xs text-white mb-0.5">{d.name}</h4>
                <p className="text-[9px] text-slate-400 line-clamp-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DYNAMIC ROLE DASHBOARD WORKSPACE */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Portal Workspace</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white capitalize">
                {currentRole === 'officer' ? 'District Officer' : currentRole === 'ngo' ? 'NGO Partner' : currentRole} Command Workspace
              </h2>
            </div>
            {!currentUser && (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="self-start sm:self-auto px-3 py-1.5 bg-slate-800 text-blue-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Authenticate Role Account
              </button>
            )}
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Live Disaster Map & Safe Zones
              </h2>
            </div>
          </div>
          <LiveMap emergencies={emergencies} reliefCenters={reliefCenters} />
        </section>
      </main>

      <Footer />

      <ReportEmergencyModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} onSuccess={loadPortalData} />
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <MobileBottomNav currentRole={currentRole} onRoleChange={setCurrentRole} onOpenSOS={() => setIsSOSOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />
      <AIChatbot />
    </div>
  );
}
