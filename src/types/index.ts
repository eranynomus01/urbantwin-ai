export type UserRole = 'citizen' | 'volunteer' | 'officer' | 'ngo' | 'admin';

export type DisasterType = 
  | 'Flood' 
  | 'Fire' 
  | 'Earthquake' 
  | 'Cyclone' 
  | 'Heatwave' 
  | 'Landslide' 
  | 'Medical Emergency';

export type SOSStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Cancelled';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  lat?: number;
  lng?: number;
}

export interface EmergencyReport {
  id: number;
  user_name: string;
  disaster_type: DisasterType;
  description: string;
  lat: number;
  lng: number;
  location_name: string;
  people_affected: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  ai_severity: number; // 1-10
  ai_category: string;
  ai_recommended_team: string;
  ai_summary?: string;
  status: SOSStatus;
  assigned_team?: string;
  image_url?: string;
  created_at: string;
}

export interface ReliefCenter {
  id: number;
  name: string;
  location_name: string;
  lat: number;
  lng: number;
  capacity: number;
  current_occupancy: number;
  available_beds: number;
  medical_staff: number;
  food_stock_days: number;
  water_stock_days: number;
  medicines: string;
  generator_status: string;
  contact_phone: string;
  distance_km?: number;
}

export interface ResourceItem {
  id: number;
  owner: string;
  item_type: string;
  quantity: number;
  unit: string;
  lat?: number;
  lng?: number;
  updated_at?: string;
}

export interface VolunteerProfile {
  id: number;
  user_id: number;
  name?: string;
  email?: string;
  phone?: string;
  status: 'pending' | 'verified' | 'rejected';
  skills: string[];
  availability: boolean;
  completed_missions: number;
  performance_score: number;
  certificate_url?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  created_at: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  performed_by: string;
  details?: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  severity: number;
  category: string;
  recommended_team: string;
  priority_level: string;
  summary: string;
  duplicate_risk: string;
}
