import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET() {
  const emergencies = globalStore.emergencies;
  const volunteers = globalStore.volunteers;
  const reliefCenters = globalStore.reliefCenters;
  const resources = globalStore.resources;

  const total_emergencies = emergencies.length;
  const active_volunteers = volunteers.filter((v) => v.status === 'verified').length;
  const relief_centers_count = reliefCenters.length;
  const people_rescued = emergencies
    .filter((e) => e.status === 'Resolved')
    .reduce((acc, curr) => acc + curr.people_affected, 0);
  const resources_delivered = resources.reduce((acc, curr) => acc + curr.quantity, 0);

  const by_type: Record<string, number> = {
    Flood: 0, Fire: 0, Earthquake: 0, Cyclone: 0, Heatwave: 0, Landslide: 0, 'Medical Emergency': 0
  };
  emergencies.forEach((e) => {
    if (by_type[e.disaster_type] !== undefined) {
      by_type[e.disaster_type] += 1;
    }
  });

  const by_status: Record<string, number> = {
    Pending: 0, Assigned: 0, 'In Progress': 0, Resolved: 0
  };
  emergencies.forEach((e) => {
    if (by_status[e.status] !== undefined) {
      by_status[e.status] += 1;
    }
  });

  return NextResponse.json({
    total_emergencies,
    active_volunteers,
    relief_centers: relief_centers_count,
    people_rescued,
    resources_delivered,
    disaster_distribution: by_type,
    status_distribution: by_status,
    avg_response_time_minutes: total_emergencies > 0 ? 12.0 : 0
  });
}
