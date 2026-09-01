'use client';

import React from 'react';
import { RealTimeCityTelemetry } from '@/types';
import { CloudRain, Wind, Activity, Gauge, Flame, AlertCircle, Compass, Thermometer } from 'lucide-react';

interface RealTimeTelemetryProps {
  telemetry: RealTimeCityTelemetry;
  isLoading?: boolean;
}

export default function RealTimeTelemetry({ telemetry, isLoading }: RealTimeTelemetryProps) {
  const { weather, airQuality, trafficSummary, emergencyStatus } = telemetry;

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (aqi <= 100) return 'text-lime-400 bg-lime-950/60 border-lime-500/40';
    if (aqi <= 200) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    if (aqi <= 300) return 'text-orange-400 bg-orange-950/60 border-orange-500/40';
    return 'text-red-400 bg-red-950/60 border-red-500/40';
  };

  const aqiBadgeStyle = getAqiColor(airQuality.aqi);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 text-xs text-slate-200 shadow-lg">
      <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* City Live Badge */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <div>
            <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <span>{telemetry.cityName}</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800 font-semibold">
                Live Twin
              </span>
            </div>
          </div>
        </div>

        {/* 1. WEATHER CARD */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 min-w-[200px]">
          <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100">{weather.temperatureC}°C</span>
              <span className="text-slate-400 text-[11px]">(Feels {weather.feelsLikeC}°C)</span>
              <span className="text-[11px] text-cyan-400 font-medium">💧 {weather.humidityPct}%</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="truncate max-w-[130px] font-medium text-slate-300" title={weather.sourceName}>
                Src: {weather.sourceName.split(' ')[0]}
              </span>
              <span className="text-amber-400/90 shrink-0 font-mono">🕒 {weather.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 2. RAIN & WIND CARD */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 min-w-[190px]">
          <CloudRain className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100">
                Rain: <b className="text-cyan-300">{weather.rainfallMmPerHr} mm/h</b>
              </span>
              <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                <Wind className="w-3 h-3 text-slate-400" /> {weather.windSpeedKmh} km/h {weather.windDirection}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="text-slate-300">Src: Open-Meteo</span>
              <span className="text-cyan-400/90 shrink-0 font-mono">🕒 {weather.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 3. AIR QUALITY / AQI CARD */}
        <div className={`flex items-center gap-3 border rounded-lg px-3 py-1.5 min-w-[210px] ${aqiBadgeStyle}`}>
          <Activity className="w-5 h-5 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm">AQI {airQuality.aqi}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-black/40">
                {airQuality.category}
              </span>
              <span className="text-[10px] opacity-80">PM2.5: {airQuality.pm25}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] opacity-80 mt-0.5">
              <span className="truncate max-w-[120px]" title={airQuality.sourceName}>
                Src: {airQuality.sourceName.split(' ')[0]}
              </span>
              <span className="shrink-0 font-mono">🕒 {airQuality.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 4. TRAFFIC FLOW CARD */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 min-w-[200px]">
          <Gauge className="w-5 h-5 text-orange-400 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100">
                Traffic Stress: <span className="text-orange-400">{trafficSummary.overallIndex}%</span>
              </span>
              <span className="text-slate-400 text-[10px]">Avg {trafficSummary.avgCitySpeedKmh} km/h</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="text-slate-300 truncate max-w-[120px]">Src: GMDA ICCC</span>
              <span className="text-orange-400/90 shrink-0 font-mono">🕒 {trafficSummary.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 5. EMERGENCY RESPONSE STATUS */}
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-slate-100 text-[11px]">
              Avg Response: <b className="text-emerald-400">{emergencyStatus.avgFireResponseTimeMin}m Fire</b> / <b className="text-cyan-400">{emergencyStatus.avgAmbulanceResponseTimeMin}m Med</b>
            </span>
            <span className="text-[10px] text-slate-400">
              System Readiness: <span className="text-emerald-400 font-bold">{emergencyStatus.systemAlertLevel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
