from sqlalchemy.orm import Session

from app.database.models import Task


def create_task(
    db: Session,
    user_id: int,
    task_title: str,
    scheduled_date,
    description=None,
    priority="medium",
):
    task = Task(
        user_id=user_id,
        task_title=task_title,
        description=description,
        priority=priority,
        scheduled_date=scheduled_date,
        status="pending",
        progress=0,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(db: Session, user_id: int):
    tasks = (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )

    return tasks


def get_task(
    db: Session,
    task_id: int,
    user_id: int,
):
    return (
        db.query(Task)
        .filter(
            Task.task_id == task_id,
            Task.user_id == user_id,
        )
        .first()
    )


def update_task(
    db: Session,
    task: Task,
):
    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task: Task,
):
    db.delete(task)
    db.commit()