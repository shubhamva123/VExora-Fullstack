import { request } from "./api-client";

export interface DashboardStats {
  total_notes: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  overdue_tasks: number;
  today_tasks: number;
  high_priority_tasks: number;
  revision_notes: number;
  calendar_events: number;
}

export interface DashboardTask {
  id: number;
  title: string;
  status: string;
  priority: string;
  progress: number;
}

export interface DashboardNote {
  id: number;
  title: string;
  is_for_revision: boolean;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_tasks: DashboardTask[];
  recent_notes: DashboardNote[];
}

const dashboardService = {
  getDashboard() {
    return request<DashboardResponse>({
      method: "GET",
      url: "/dashboard",
    });
  },
};

export default dashboardService;