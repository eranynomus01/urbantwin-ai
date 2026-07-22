'use client';
import React from 'react';
import { UserRole } from '@/types';
import { Home, MapPin, AlertTriangle, UserCheck, Bot } from 'lucide-react';

interface MobileBottomNavProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSOS: () => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  onRoleChange,
  onOpenSOS,
  onOpenAuth
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around text-slate-400">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white"
      >
        <Home className="w-5 h-5 text-blue-400" />
        <span>Home</span>
      </button>

      <button
        onClick={() => {
          const mapElem = document.getElementById('live-map-section');
          if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white"
      >
        <MapPin className="w-5 h-5 text-emerald-400" />
        <span>Live Map</span>
      </button>

      {/* Floating Center SOS Touch Target */}
      <button
        onClick={onOpenSOS}
        className="-mt-5 p-3.5 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-full shadow-2xl sos-glow flex items-center justify-center border-2 border-white/20 active:scale-90 transition-transform"
      >
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </button>

      <button
        onClick={onOpenAuth}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white"
      >
        <UserCheck className="w-5 h-5 text-purple-400" />
        <span>Account</span>
      </button>

      <button
        onClick={() => {
          const chatBtn = document.querySelector<HTMLButtonElement>('.fixed.bottom-6.right-6');
          if (chatBtn) chatBtn.click();
        }}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white"
      >
        <Bot className="w-5 h-5 text-amber-400" />
        <span>AIDA AI</span>
      </button>
    </div>
  );
};
