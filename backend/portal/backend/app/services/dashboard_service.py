from datetime import date

from sqlalchemy.orm import Session

from app.database.models import (
    CalendarEvent,
    Note,
    Task,
)


def get_dashboard_data(
    db: Session,
    user_id: int,
):
    total_notes = (
        db.query(Note)
        .filter(Note.user_id == user_id)
        .count()
    )

    total_tasks = (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "completed",
        )
        .count()
    )

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "pending",
        )
        .count()
    )

    today_events = (
        db.query(CalendarEvent)
        .filter(
            CalendarEvent.user_id == user_id,
            CalendarEvent.event_date == date.today(),
        )
        .count()
    )

    return {
        "total_notes": total_notes,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "today_events": today_events,
    }