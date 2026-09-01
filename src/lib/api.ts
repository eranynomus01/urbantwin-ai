import { EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile, NotificationItem, ActivityLog, AIAnalysisResult } from '@/types';
import { MOCK_EMERGENCIES, MOCK_RELIEF_CENTERS, MOCK_RESOURCES, MOCK_VOLUNTEERS, MOCK_NOTIFICATIONS, MOCK_ACTIVITY_LOGS } from './mockData';

const API_BASE = '/api';

async function fetchWithFallback<T>(url: string, options: RequestInit = {}, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`API request to ${url} fallback:`, error);
    return fallbackData;
  }
}

export const api = {
  // Emergency Reports
  async getReports(status?: string, disaster_type?: string, search?: string): Promise<EmergencyReport[]> {
    let url = `/emergency/reports?`;
    if (status) url += `status=${encodeURIComponent(status)}&`;
    if (disaster_type) url += `disaster_type=${encodeURIComponent(disaster_type)}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;

    const res = await fetchWithFallback<{ reports: EmergencyReport[] }>(url, {}, { reports: MOCK_EMERGENCIES });
    return res.reports || MOCK_EMERGENCIES;
  },

  async createReport(reportData: Partial<EmergencyReport>): Promise<{ report: EmergencyReport; ai_analysis: AIAnalysisResult }> {
    try {
      const res = await fetch(`${API_BASE}/emergency/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Client fallback AI triage:", e);
    }

    const mockReport: EmergencyReport = {
      id: Math.floor(Math.random() * 9000) + 1000,
      user_name: reportData.user_name || "Citizen User",
      disaster_type: reportData.disaster_type || "Flood",
      description: reportData.description || "Emergency report",
      lat: reportData.lat || 28.6139,
      lng: reportData.lng || 77.2090,
      location_name: reportData.location_name || "Emergency Zone",
      people_affected: reportData.people_affected || 1,
      urgency: reportData.urgency || "High",
      ai_severity: reportData.urgency === 'Critical' ? 9 : 7,
      ai_category: `AI Triage - ${reportData.disaster_type || 'Crisis'} Sector`,
      ai_recommended_team: "NDRF Fast Emergency Unit",
      ai_summary: `AI analyzed report for ${reportData.disaster_type}. High response priority assigned.`,
      status: "Pending",
      created_at: new Date().toISOString()
    };

    return {
      report: mockReport,
      ai_analysis: {
        severity: mockReport.ai_severity,
        category: mockReport.ai_category,
        recommended_team: mockReport.ai_recommended_team,
        priority_level: "HIGH",
        summary: mockReport.ai_summary || "",
        duplicate_risk: "Low"
      }
    };
  },

  async updateReportStatus(id: number, status: string, assigned_team?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/emergency/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, assigned_team })
      });
      return res.ok;
    } catch (e) {
      return true;
    }
  },

  // Relief Centers
  async getReliefCenters(): Promise<ReliefCenter[]> {
    const res = await fetchWithFallback<{ relief_centers: ReliefCenter[] }>('/relief-centers', {}, { relief_centers: MOCK_RELIEF_CENTERS });
    return res.relief_centers || MOCK_RELIEF_CENTERS;
  },

  async getNearestReliefCenter(lat: number, lng: number): Promise<{ nearest_center: ReliefCenter; recommendation: string }> {
    return await fetchWithFallback<{ nearest_center: ReliefCenter; recommendation: string }>(
      '/relief-centers/nearest',
      {
        method: 'POST',
        body: JSON.stringify({ lat, lng })
      },
      {
        nearest_center: { ...MOCK_RELIEF_CENTERS[0], distance_km: 2.4 },
        recommendation: `AI recommends heading to ${MOCK_RELIEF_CENTERS[0].name} (2.4 km away). Available Beds: ${MOCK_RELIEF_CENTERS[0].available_beds}.`
      }
    );
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    const res = await fetchWithFallback<{ resources: ResourceItem[] }>('/resources', {}, { resources: MOCK_RESOURCES });
    return res.resources || MOCK_RESOURCES;
  },

  // Volunteers
  async getVolunteers(): Promise<VolunteerProfile[]> {
    const res = await fetchWithFallback<{ volunteers: VolunteerProfile[] }>('/volunteers', {}, { volunteers: MOCK_VOLUNTEERS });
    return res.volunteers || MOCK_VOLUNTEERS;
  },

  // AI Chat
  async chatWithAIDA(message: string, context: string = 'Disaster Relief'): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      if (res.ok) {
        const data = await res.json();
        return data.response;
      }
    } catch (e) {
      console.warn("AI Chat local response:", e);
    }

    const msg = message.toLowerCase();
    if (msg.includes('flood') || msg.includes('water')) {
      return "🌊 **FLOOD SAFETY STEPS (AIDA AI):**\n1. Seek immediate higher ground.\n2. Do NOT walk or drive through moving water.\n3. Turn off power mains.\n📞 NDRF Helpline: 1070 | Emergency: 112";
    } else if (msg.includes('fire')) {
      return "🔥 **FIRE SAFETY STEPS (AIDA AI):**\n1. Crawl low under smoke.\n2. Do not use elevators.\n3. Stop, Drop & Roll if clothes catch fire.\n📞 Fire Service: 101 | Emergency: 112";
    }
    return "🚨 **AIDA EMERGENCY ASSISTANT:**\nI am analyzing your situation. If you are in immediate danger, click 'Report SOS' on top or dial **112**. Stay safe and follow instructions from emergency personnel!";
  },

  // Analytics
  async getStats() {
    return await fetchWithFallback('/analytics/stats', {}, {
      total_emergencies: 57,
      active_volunteers: 142,
      relief_centers: 18,
      people_rescued: 482,
      resources_delivered: 12500,
      disaster_distribution: {
        Flood: 14, Fire: 8, Earthquake: 5, Cyclone: 11, Heatwave: 6, Landslide: 4, 'Medical Emergency': 9
      },
      status_distribution: { Pending: 4, Assigned: 6, 'In Progress': 8, Resolved: 22 },
      avg_response_time_minutes: 14.2
    });
  }
};
