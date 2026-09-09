import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrbanTwin AI — Next-Gen Urban Digital Twin & Decision Support Platform',
  description: 'AI-powered urban digital twin decision-support platform for Hisar and Haryana, India. Featuring real GIS spatial data, live environmental telemetry, predictive What-If simulations, and Gemini AI planning intelligence.',
  keywords: ['Urban Digital Twin', 'Hisar GIS', 'Haryana Smart Cities', 'What-If Urban Simulation', 'AI Urban Planner', 'Disaster & Emergency Response'],
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
