import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrbanTwin AI — Real-Time Urban Digital Twin & Decision Support Platform',
  description: 'Production-ready urban digital twin for Gurugram, India. Combining real PostGIS GIS data, live OpenAQ & Open-Meteo telemetry, OSRM routing simulation, and Gemini AI planning intelligence.',
  keywords: ['Urban Digital Twin', 'Gurugram GIS', 'Smart Cities India', 'What-If Urban Simulation', 'AI Urban Planner', 'Disaster & Emergency Response'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
