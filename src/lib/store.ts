import { EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile, ActivityLog, NotificationItem } from '@/types';
import { MOCK_EMERGENCIES, MOCK_RELIEF_CENTERS, MOCK_RESOURCES, MOCK_VOLUNTEERS, MOCK_NOTIFICATIONS, MOCK_ACTIVITY_LOGS } from './mockData';

class GlobalStore {
  public emergencies: EmergencyReport[] = [...MOCK_EMERGENCIES];
  public reliefCenters: ReliefCenter[] = [...MOCK_RELIEF_CENTERS];
  public resources: ResourceItem[] = [...MOCK_RESOURCES];
  public volunteers: VolunteerProfile[] = [...MOCK_VOLUNTEERS];
  public notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];
  public logs: ActivityLog[] = [...MOCK_ACTIVITY_LOGS];

  public addReport(report: EmergencyReport) {
    this.emergencies.unshift(report);
    this.logs.unshift({
      id: Date.now(),
      action: 'NEW_SOS_SUBMITTED',
      performed_by: report.user_name,
      details: `Disaster: ${report.disaster_type}, Severity: ${report.ai_severity}/10`,
      timestamp: new Date().toISOString()
    });
  }

  public updateReportStatus(id: number, status: string, team?: string) {
    const report = this.emergencies.find((e) => e.id === id);
    if (report) {
      report.status = status as any;
      if (team) report.assigned_team = team;
      this.logs.unshift({
        id: Date.now(),
        action: 'STATUS_UPDATED',
        performed_by: 'District Officer',
        details: `Report #${id} status changed to ${status}`,
        timestamp: new Date().toISOString()
      });
    }
  }

  public addResource(res: ResourceItem) {
    this.resources.unshift(res);
  }
}

export const globalStore = new GlobalStore();
