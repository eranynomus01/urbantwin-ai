import { EmergencyReport, ReliefCenter, ResourceItem, VolunteerProfile, ActivityLog, NotificationItem } from '@/types';

class GlobalStore {
  public emergencies: EmergencyReport[] = [];
  public reliefCenters: ReliefCenter[] = [];
  public resources: ResourceItem[] = [];
  public volunteers: VolunteerProfile[] = [];
  public notifications: NotificationItem[] = [];
  public logs: ActivityLog[] = [];

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
