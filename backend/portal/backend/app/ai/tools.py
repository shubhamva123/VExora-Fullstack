from datetime import date
from sqlalchemy.orm import Session

from app.database.models import Task


def get_user_tasks(
    db: Session,
    user_id: int,
):
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.scheduled_date.asc())
        .all()
    )


def create_user_task(
    db: Session,
    user_id: int,
    task_title: str,
    scheduled_date: date,
):
    task = Task(
        user_id=user_id,
        task_title=task_title,
        scheduled_date=scheduled_date,
        status="pending",
        progress=0,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def complete_user_task(
    db: Session,
    user_id: int,
    task_id: int,
):
    task = (
        db.query(Task)
        .filter(
            Task.task_id == task_id,
            Task.user_id == user_id,
        )
        .first()
    )

    if not task:
        return None

    task.status = "completed"
    task.progress = 100

    db.commit()
    db.refresh(task)

    return task