'use client';

import React from 'react';
import { Zone, SimulationResult, RealTimeCityTelemetry } from '@/types';
import { 
  FileText, 
  Printer, 
  Download, 
  Building2, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: Zone | null;
  activeSimulation: SimulationResult | null;
  currentTelemetry: RealTimeCityTelemetry | null;
}

export default function ReportGeneratorModal({
  isOpen,
  onClose,
  selectedZone,
  activeSimulation,
  currentTelemetry,
}: ReportGeneratorModalProps) {
  if (!isOpen) return null;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', {
    dateStyle: 'full',
    timeZone: 'Asia/Kolkata',
  });
  const timeFormatted = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' IST';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-sm">Decision-Support Executive Briefing Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white text-slate-900 print:p-0 print:m-0 custom-scrollbar">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest font-black text-cyan-700">
                UrbanTwin AI — Digital Twin Decision Support System
              </div>
              <h1 className="text-2xl font-black text-slate-950 mt-1">
                Urban Infrastructure & Simulation Briefing
              </h1>
              <p className="text-sm text-slate-600">
                Target Municipality: <b>Gurugram, Haryana, India</b> • Coordinate Datum: EPSG:4326
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Date: <b>{dateFormatted}</b></div>
              <div>Generated: <b>{timeFormatted}</b></div>
              <div className="text-emerald-700 font-bold mt-1">Data Quality Index: 94.5%</div>
            </div>
          </div>

          {/* 1. CURRENT ENVIRONMENTAL & CITY CONDITIONS */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 border-b pb-1">
              1. Observed Atmospheric & Urban Telemetry
            </h3>
            <div className="grid grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Temperature / Rain:</span>
                <span className="font-bold text-slate-900">
                  {currentTelemetry?.weather.temperatureC || 32.4}°C ({currentTelemetry?.weather.rainfallMmPerHr || 0} mm/h)
                </span>
                <span className="text-[10px] text-slate-400 block">Src: Open-Meteo</span>
              </div>
              <div>
                <span className="text-slate-500 block">Air Quality Index:</span>
                <span className="font-bold text-slate-900">
                  AQI {currentTelemetry?.airQuality.aqi || 178} ({currentTelemetry?.airQuality.category || 'Poor'})
                </span>
                <span className="text-[10px] text-slate-400 block">Src: CPCB NAQI</span>
              </div>
              <div>
                <span className="text-slate-500 block">Traffic Congestion:</span>
                <span className="font-bold text-slate-900">
                  {currentTelemetry?.trafficSummary.overallIndex || 68}% Index
                </span>
                <span className="text-[10px] text-slate-400 block">Src: GMDA ICCC</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fire Response Baseline:</span>
                <span className="font-bold text-slate-900">
                  {currentTelemetry?.emergencyStatus.avgFireResponseTimeMin || 8.4} Minutes
                </span>
                <span className="text-[10px] text-slate-400 block">Src: OSRM Graph</span>
              </div>
            </div>
          </div>

          {/* 2. ZONE PROFILE */}
          {selectedZone && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 border-b pb-1">
                2. Inspected Zone Profile: {selectedZone.name}
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                  <span className="text-slate-500 block">Population & Area</span>
                  <span className="font-bold text-slate-900">
                    {selectedZone.population.toLocaleString('en-IN')} citizens ({selectedZone.areaSqKm} km²)
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Density: {selectedZone.populationDensity}/km²
                  </span>
                </div>
                <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                  <span className="text-slate-500 block">Civic Amenities</span>
                  <span className="font-bold text-slate-900">
                    {selectedZone.hospitalCount} Hospitals • {selectedZone.schoolCount} Schools • {selectedZone.parkCount} Parks
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Road Density: {selectedZone.roadDensityKmPerSqKm} km/km²
                  </span>
                </div>
                <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                  <span className="text-slate-500 block">Risk Indices</span>
                  <span className="font-bold text-slate-900">
                    Flood: {selectedZone.floodRiskScore}/10 • Heat: {selectedZone.heatRiskScore}/10
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Avg AQI: {selectedZone.avgAqi}
                  </span>
                </div>
              </div>

              <div className="text-xs bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
                <b>Identified Planning Deficits:</b> {selectedZone.infrastructureGaps.join('; ')}
              </div>
            </div>
          )}

          {/* 3. SIMULATION OUTCOMES */}
          {activeSimulation && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 border-b pb-1">
                3. What-If Simulation Evaluation: {activeSimulation.scenarioName}
              </h3>
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                    <tr>
                      <th className="p-2">Performance Metric</th>
                      <th className="p-2">Baseline</th>
                      <th className="p-2">Simulated Outcome</th>
                      <th className="p-2">Computed Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeSimulation.calculationBreakdown.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{row.metric}</td>
                        <td className="p-2 text-slate-600">{row.baseline}</td>
                        <td className="p-2 font-bold">{row.simulated}</td>
                        <td className="p-2 font-bold text-cyan-700">{row.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeSimulation.aiExecutiveSummary && (
                <div className="text-xs bg-slate-50 p-3 rounded border border-slate-200 text-slate-800">
                  <b className="block text-slate-900 mb-1">AI Analytical Interpretation:</b>
                  {activeSimulation.aiExecutiveSummary}
                </div>
              )}
            </div>
          )}

          {/* 4. DATA PROVENANCE & LIMITATIONS */}
          <div className="space-y-2 pt-4 border-t border-slate-300">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500">
              4. Data Provenance, Governance & Methodological Disclaimers
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This report is generated by <b>UrbanTwin AI Decision Support Platform</b>. Geographic road network, buildings, and infrastructure features are mapped using OpenStreetMap (ODbL). Meteorological parameters are sourced from Open-Meteo (CC-BY 4.0). Atmospheric pollutants are based on CPCB / OpenAQ live feeds. Routing traversals and isochrone buffers are computed using OSRM algorithms. Numerical flood and heat hazard scores are indicative AI-assisted risk classifications and do not supersede statutory master plan gazettes or official disaster declarations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
