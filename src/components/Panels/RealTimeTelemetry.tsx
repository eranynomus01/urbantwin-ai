'use client';

import React from 'react';
import { RealTimeCityTelemetry } from '@/types';
import { Thermometer, Wind, Activity, Gauge, Shield } from 'lucide-react';

const AQI_COLORS: Record<string, string> = {
  'Good': '#34d399',
  'Moderate': '#fbbf24',
  'Poor': '#f97316',
  'Very Poor': '#ef4444',
  'Severe': '#dc2626',
};

export default function RealTimeTelemetry({ telemetry }: { telemetry: RealTimeCityTelemetry }) {
  const { weather, airQuality, trafficSummary, emergencyStatus } = telemetry;
  const aqiColor = AQI_COLORS[airQuality.category] || '#f97316';

  const tiles = [
    {
      icon: <Thermometer className="w-4 h-4 text-amber-400" />,
      label: 'Temperature',
      value: `${weather.temperatureC}°C`,
      sub: `Feels ${weather.feelsLikeC}°C · ${weather.humidityPct}% humidity`,
      source: 'Open-Meteo',
    },
    {
      icon: <Wind className="w-4 h-4 text-sky-400" />,
      label: 'Wind / Rain',
      value: `${weather.windSpeedKmh} km/h ${weather.windDirection}`,
      sub: `Precip: ${weather.rainfallMmPerHr} mm/h`,
      source: 'ECMWF Grid',
    },
    {
      icon: <Activity className="w-4 h-4" style={{ color: aqiColor }} />,
      label: 'Air Quality (AQI)',
      value: String(airQuality.aqi),
      sub: `${airQuality.category} · PM2.5: ${airQuality.pm25} µg/m³`,
      source: 'CPCB NAQI',
      valueColor: aqiColor,
    },
    {
      icon: <Gauge className="w-4 h-4 text-orange-400" />,
      label: 'Traffic Stress',
      value: `${trafficSummary.overallIndex}%`,
      sub: `Avg speed: ${trafficSummary.avgCitySpeedKmh} km/h · ${trafficSummary.congestedCorridorsCount} congested`,
      source: 'GMDA ICCC',
    },
    {
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      label: 'Emergency Status',
      value: emergencyStatus.systemAlertLevel,
      sub: `Fire ETA: ${emergencyStatus.avgFireResponseTimeMin}m · Amb: ${emergencyStatus.avgAmbulanceResponseTimeMin}m`,
      source: 'OSRM Grid',
      valueColor: emergencyStatus.systemAlertLevel === 'NORMAL' ? '#34d399' : '#f97316',
    },
  ];

  return (
    <div className="w-full shrink-0 border-b border-white/[0.05] bg-[#080d1a]/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 py-2 overflow-x-auto no-scrollbar">
        {/* City Live Marker */}
        <div className="flex items-center gap-2 pr-4 mr-1 border-r border-white/[0.07] shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-xs font-bold text-slate-200">{telemetry.cityName}</span>
          <span className="badge-live">Live</span>
        </div>

        {/* Tiles */}
        {tiles.map((tile) => (
          <div key={tile.label} className="telemetry-tile group">
            {tile.icon}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-extrabold" style={{ color: tile.valueColor || '#f1f5f9' }}>
                  {tile.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">{tile.label}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight hidden md:block">{tile.sub}</div>
            </div>
            {/* Source tooltip on hover */}
            <div className="hidden group-hover:block absolute top-full mt-1 left-0 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-sky-400 font-medium shadow-xl z-50 whitespace-nowrap pointer-events-none">
              Source: {tile.source} · {weather.lastUpdated}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
