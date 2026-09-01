'use client';

import React from 'react';
import { RealTimeCityTelemetry } from '@/types';
import { CloudRain, Wind, Activity, Gauge, Thermometer, ShieldCheck, CheckCircle, ExternalLink } from 'lucide-react';

interface RealTimeTelemetryProps {
  telemetry: RealTimeCityTelemetry;
  isLoading?: boolean;
}

export default function RealTimeTelemetry({ telemetry }: RealTimeTelemetryProps) {
  const { weather, airQuality, trafficSummary, emergencyStatus } = telemetry;

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50 shadow-emerald-950/30';
    if (aqi <= 100) return 'text-lime-400 bg-lime-950/70 border-lime-500/50 shadow-lime-950/30';
    if (aqi <= 200) return 'text-amber-400 bg-amber-950/70 border-amber-500/50 shadow-amber-950/30';
    if (aqi <= 300) return 'text-orange-400 bg-orange-950/70 border-orange-500/50 shadow-orange-950/30';
    return 'text-red-400 bg-red-950/70 border-red-500/50 shadow-red-950/30';
  };

  const aqiBadgeStyle = getAqiColor(airQuality.aqi);

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-2 text-xs text-slate-200 shadow-xl z-20">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* City Live Indicator */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <div>
            <div className="font-extrabold text-slate-100 text-sm flex items-center gap-1.5">
              <span>{telemetry.cityName}</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono font-bold">
                Live Twin
              </span>
            </div>
          </div>
        </div>

        {/* 1. WEATHER TELEMETRY */}
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-1.5 shadow-md">
          <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-slate-100">{weather.temperatureC}°C</span>
              <span className="text-slate-400 text-[11px]">(Feels {weather.feelsLikeC}°C)</span>
              <span className="text-[11px] text-cyan-400 font-semibold">💧 {weather.humidityPct}%</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> Open-Meteo
              </span>
              <span className="text-amber-400/90 shrink-0 font-mono">{weather.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 2. RAIN & PRECIPITATION */}
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-1.5 shadow-md">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">
                Precipitation: <b className="text-cyan-300">{weather.rainfallMmPerHr} mm/h</b>
              </span>
              <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                <Wind className="w-3 h-3 text-slate-400" /> {weather.windSpeedKmh} km/h {weather.windDirection}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
              <span className="text-slate-300">ECMWF / DWD Grid</span>
              <span className="text-cyan-400/90 shrink-0 font-mono">{weather.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 3. AIR QUALITY / AQI */}
        <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-1.5 shadow-md ${aqiBadgeStyle}`}>
          <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm">AQI {airQuality.aqi}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-black/50">
                {airQuality.category}
              </span>
              <span className="text-[10px] opacity-90 font-medium">PM2.5: {airQuality.pm25}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] opacity-90 mt-0.5 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> CPCB NAQI Feed
              </span>
              <span className="shrink-0 font-mono">{airQuality.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 4. TRAFFIC FLOW STATUS */}
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-1.5 shadow-md">
          <div className="w-7 h-7 rounded-lg bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100">
                Traffic Stress: <span className="text-orange-400 font-extrabold">{trafficSummary.overallIndex}%</span>
              </span>
              <span className="text-slate-400 text-[10px]">Avg {trafficSummary.avgCitySpeedKmh} km/h</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
              <span className="text-slate-300">GMDA ICCC Telemetry</span>
              <span className="text-orange-400/90 shrink-0 font-mono">{trafficSummary.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 5. EMERGENCY READINESS */}
        <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-1.5 shadow-md">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-100 text-[11px]">
              Avg Dispatch: <b className="text-emerald-400 font-extrabold">{emergencyStatus.avgFireResponseTimeMin}m Fire</b> • <b className="text-cyan-400 font-extrabold">{emergencyStatus.avgAmbulanceResponseTimeMin}m Med</b>
            </span>
            <span className="text-[10px] text-slate-400">
              Readiness: <span className="text-emerald-400 font-bold">{emergencyStatus.systemAlertLevel}</span> (OSRM Grid)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
