import { EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile, ActivityLog, NotificationItem } from '@/types';

export const MOCK_EMERGENCIES: EmergencyReport[] = [
  {
    id: 101,
    user_name: "Sunil Kumar",
    disaster_type: "Flood",
    description: "Severe Yamuna river water overflow. 45 residents stranded on rooftop near East Bank school.",
    lat: 28.6100,
    lng: 77.2900,
    location_name: "Yamuna Bank Sector 3",
    people_affected: 45,
    urgency: "Critical",
    ai_severity: 9,
    ai_category: "Severe Rooftop Inundation Evacuation",
    ai_recommended_team: "NDRF Amphibious Battalion #3",
    ai_summary: "High priority flood emergency affecting 45 stranded citizens needing immediate motorboat deployment.",
    status: "In Progress",
    assigned_team: "NDRF Amphibious Battalion #3",
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 102,
    user_name: "Anita Sharma",
    disaster_type: "Fire",
    description: "Transformer explosion caused major blaze in commercial market area. Thick black smoke filling streets.",
    lat: 28.6500,
    lng: 77.2300,
    location_name: "Chandni Chowk Market Complex",
    people_affected: 14,
    urgency: "High",
    ai_severity: 8,
    ai_category: "Commercial Electrical Fire Hazard",
    ai_recommended_team: "Delhi Fire Services Squad 2",
    ai_summary: "Dense market fire with hazardous electrical transformer involved. Smoke inhalation threat.",
    status: "Assigned",
    assigned_team: "Delhi Fire Services Squad 2",
    created_at: new Date(Date.now() - 40 * 60000).toISOString()
  },
  {
    id: 103,
    user_name: "Rajesh Verma",
    disaster_type: "Medical Emergency",
    description: "Heatstroke victim collapsed at busy bus shelter requiring urgent IV fluid & oxygen.",
    lat: 28.6300,
    lng: 77.2100,
    location_name: "ISBT Transit Terminal",
    people_affected: 1,
    urgency: "Critical",
    ai_severity: 7,
    ai_category: "Heat Collapse & Dehydration",
    ai_recommended_team: "102 Mobile Paramedic Unit",
    ai_summary: "Unconscious heatstroke individual requires immediate ACLS ambulance.",
    status: "Pending",
    assigned_team: "Unassigned",
    created_at: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 104,
    user_name: "Pooja Roy",
    disaster_type: "Earthquake",
    description: "Wall cracks observed after 4.7 earthquake tremor. Requesting safety inspection of 4-story building.",
    lat: 28.5800,
    lng: 77.2400,
    location_name: "Lajpat Nagar Block B",
    people_affected: 6,
    urgency: "Medium",
    ai_severity: 4,
    ai_category: "Post-Tremor Structural Integrity Check",
    ai_recommended_team: "PWD Disaster Safety Inspection",
    ai_summary: "Non-critical structural assessment following mild tremor.",
    status: "Resolved",
    assigned_team: "PWD Safety Inspection Team",
    created_at: new Date(Date.now() - 180 * 60000).toISOString()
  }
];

export const MOCK_RELIEF_CENTERS: ReliefCenter[] = [
  {
    id: 1,
    name: "Central National Relief Shelter",
    location_name: "Connaught Complex Sector 4, New Delhi",
    lat: 28.6289,
    lng: 77.2189,
    capacity: 800,
    current_occupancy: 320,
    available_beds: 480,
    medical_staff: 24,
    food_stock_days: 18,
    water_stock_days: 14,
    medicines: "Abundant",
    generator_status: "Operational",
    contact_phone: "+91 1800-112-901"
  },
  {
    id: 2,
    name: "North Stadium Emergency Care Center",
    location_name: "Civil Lines, New Delhi",
    lat: 28.6812,
    lng: 77.2225,
    capacity: 1200,
    current_occupancy: 890,
    available_beds: 310,
    medical_staff: 35,
    food_stock_days: 12,
    water_stock_days: 10,
    medicines: "Adequate",
    generator_status: "Operational",
    contact_phone: "+91 1800-112-902"
  },
  {
    id: 3,
    name: "East Riverside Disaster Camp",
    location_name: "Mayur Vihar Phase 1",
    lat: 28.6080,
    lng: 77.2950,
    capacity: 600,
    current_occupancy: 450,
    available_beds: 150,
    medical_staff: 18,
    food_stock_days: 8,
    water_stock_days: 6,
    medicines: "Restock Needed",
    generator_status: "Operational",
    contact_phone: "+91 1800-112-903"
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  { id: 1, owner: "District Authority", item_type: "Food Packets", quantity: 6500, unit: "Packets" },
  { id: 2, owner: "District Authority", item_type: "Clean Water", quantity: 15000, unit: "Liters" },
  { id: 3, owner: "Seva NGO Foundation", item_type: "Medical Emergency Kits", quantity: 920, unit: "Kits" },
  { id: 4, owner: "Seva NGO Foundation", item_type: "Thermal Blankets", quantity: 3400, unit: "Units" },
  { id: 5, owner: "NDRF Fleet Command", item_type: "Rescue Boats", quantity: 22, unit: "Vessels" },
  { id: 6, owner: "Red Cross Disaster", item_type: "Life Jackets", quantity: 1800, unit: "Vests" },
  { id: 7, owner: "State Health Dept", item_type: "Ambulances", quantity: 38, unit: "Vehicles" },
];

export const MOCK_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 1,
    user_id: 2,
    name: "Priya Patel",
    email: "priya@volunteer.org",
    phone: "+91 9812345678",
    status: "verified",
    skills: ["Medical First-Aid", "Rescue Swimming", "Driving (Heavy Utility)"],
    availability: true,
    completed_missions: 18,
    performance_score: 4.9,
    certificate_url: "/certificates/vol_101.pdf"
  },
  {
    id: 2,
    user_id: 5,
    name: "Arjun Mehta",
    email: "arjun@communityrescue.org",
    phone: "+91 9765432109",
    status: "pending",
    skills: ["Structural Engineering", "Drone Search & Rescue", "Multilingual (Hindi, English, Bengali)"],
    availability: true,
    completed_missions: 4,
    performance_score: 4.7
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: "IMD Weather Warning", message: "Heavy rainfall alert issued for Yamuna basin area for the next 24 hours.", type: "warning", created_at: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 2, title: "New NDRF Deployment", message: "NDRF Unit 4 dispatched to East Bank Sector 3.", type: "info", created_at: new Date(Date.now() - 120 * 60000).toISOString() },
  { id: 3, title: "Relief Center Capacity Alert", message: "East Riverside shelter reached 75% capacity.", type: "urgent", created_at: new Date(Date.now() - 240 * 60000).toISOString() }
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 1, action: "PORTAL_BROADCAST", performed_by: "Super Admin", details: "Disaster Alert issued to 14,000 citizens in Zone 4.", timestamp: new Date().toISOString() },
  { id: 2, action: "OFFICER_ASSIGNMENT", performed_by: "Dr. Vikram Singh", details: "Assigned NDRF Battalion #3 to Yamuna SOS #101", timestamp: new Date(Date.now() - 20 * 60000).toISOString() }
];
