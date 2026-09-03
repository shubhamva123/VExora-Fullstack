import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import dashboardService, {
  DashboardResponse,
} from "@/services/dashboard.service";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await dashboardService.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Unable to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back to VExora"
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Total Notes</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.total_notes ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.total_tasks ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Pending Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.pending_tasks ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.completed_tasks ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Revision Notes</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.revision_notes ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Calendar Events</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.calendar_events ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Completion Rate</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.completion_rate ?? 0}%
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Today Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.today_tasks ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">Overdue Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.overdue_tasks ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="text-sm text-muted-foreground">High Priority Tasks</h3>
          <p className="mt-2 text-3xl font-bold">
            {dashboard?.stats.high_priority_tasks ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="mb-4 text-lg font-semibold">Recent Notes</h2>

          {dashboard?.recent_notes?.length === 0 ? (
            <p className="text-muted-foreground">No notes found.</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.recent_notes?.map((note) => (
                <div key={note.id} className="rounded-lg border p-3">
                  {note.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="mb-4 text-lg font-semibold">Recent Tasks</h2>

          {dashboard?.recent_tasks?.length === 0 ? (
            <p className="text-muted-foreground">No tasks found.</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.recent_tasks?.map((task) => (
                <div key={task.id} className="rounded-lg border p-3">
                  <div className="font-medium">{task.title}</div>

                  <div className="text-sm text-muted-foreground">
                    {task.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}