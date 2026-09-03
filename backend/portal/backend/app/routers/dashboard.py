from datetime import date

from sqlalchemy import desc
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import (
    User,
    Note,
    Task,
    CalendarEvent,
)
from app.schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_notes = (
        db.query(Note)
        .filter(Note.user_id == current_user.user_id)
        .count()
    )

    total_tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.user_id)
        .count()
    )

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.user_id,
            Task.status == "pending",
        )
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.user_id,
            Task.status == "completed",
        )
        .count()
    )

    completion_rate = (
        round((completed_tasks / total_tasks) * 100, 1)
        if total_tasks > 0
        else 0
    )

    overdue_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.user_id,
            Task.status != "completed",
            Task.scheduled_date < date.today(),
        )
        .count()
    )

    today_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.user_id,
            Task.scheduled_date == date.today(),
        )
        .count()
    )

    high_priority_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.user_id,
            Task.priority == "high",
            Task.status != "completed",
        )
        .count()
    )

    revision_notes = (
        db.query(Note)
        .filter(
            Note.user_id == current_user.user_id,
            Note.is_for_revision.is_(True),
        )
        .count()
    )

    calendar_events = (
        db.query(CalendarEvent)
        .filter(CalendarEvent.user_id == current_user.user_id)
        .count()
    )

    recent_notes = (
        db.query(Note)
        .filter(Note.user_id == current_user.user_id)
        .order_by(desc(Note.created_at))
        .limit(5)
        .all()
    )

    recent_tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.user_id)
        .order_by(desc(Task.created_at))
        .limit(5)
        .all()
    )

    return DashboardResponse(
        stats={
            "total_notes": total_notes,
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": completion_rate,
            "overdue_tasks": overdue_tasks,
            "today_tasks": today_tasks,
            "high_priority_tasks": high_priority_tasks,
            "revision_notes": revision_notes,
            "calendar_events": calendar_events,
        },
        recent_tasks=[
            {
                "id": task.task_id,
                "title": task.task_title,
                "status": task.status,
                "priority": task.priority,
                "progress": task.progress,
            }
            for task in recent_tasks
        ],
        recent_notes=[
            {
                "id": note.note_id,
                "title": note.title,
                "is_for_revision": note.is_for_revision,
            }
            for note in recent_notes
        ],
    )