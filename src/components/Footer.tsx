'use client';
import React from 'react';
import { Shield, PhoneCall, Globe, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
            <Shield className="w-5 h-5 text-blue-500" /> AI Disaster Emergency Portal
          </div>
          <p className="leading-relaxed text-slate-400 mb-4">
            Next-generation national disaster management & emergency response coordination platform. Built for citizens, volunteers, district officers, and NGOs.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <Globe className="w-4 h-4" /> Smart India Hackathon (SIH 2026) Official Entry
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Emergency Helplines</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-rose-500" /> National Emergency: <span className="font-bold text-white">112</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" /> NDRF Control Room: <span className="font-bold text-white">1070 / 011-24363260</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> Fire Services: <span className="font-bold text-white">101</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Ambulance Control: <span className="font-bold text-white">102</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Disaster Modules</h4>
          <ul className="space-y-2">
            <li><a href="#live-map-section" className="hover:text-white transition-colors">Live Disaster Heatmaps</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Citizen Emergency SOS</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Volunteer Mission Portal</a></li>
            <li><a href="#" className="hover:text-white transition-colors">District Officer Dispatch Command</a></li>
            <li><a href="#" className="hover:text-white transition-colors">NGO Resource Logistics</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Security & Compliance</h4>
          <p className="leading-relaxed mb-3">
            Encrypted with Serverless Next.js API routes, Supabase PostgreSQL, and Google Gemini AI Engine. High contrast & screen reader accessible.
          </p>
          <div className="flex items-center gap-2 text-slate-500">
            <FileText className="w-4 h-4" /> ISO 27001 Certified Infrastructure
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-[11px]">
        © 2026 National Disaster Management Authority (NDMA). All Rights Reserved. Designed for SIH 2026.
      </div>
    </footer>
  );
};
