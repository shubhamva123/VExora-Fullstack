from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_notes: int
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    completion_rate: float
    overdue_tasks: int
    today_tasks: int
    high_priority_tasks: int
    revision_notes: int
    calendar_events: int


class DashboardTask(BaseModel):
    id: int
    title: str
    status: str
    priority: str
    progress: int


class DashboardNote(BaseModel):
    id: int
    title: str
    is_for_revision: bool


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_tasks: list[DashboardTask]
    recent_notes: list[DashboardNote]