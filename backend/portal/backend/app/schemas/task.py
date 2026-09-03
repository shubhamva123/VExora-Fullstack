from datetime import date
from typing import Optional

from pydantic import BaseModel


class TaskCreate(BaseModel):
    task_title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    scheduled_date: date


class TaskUpdate(BaseModel):
    task_title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    scheduled_date: Optional[date] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    dueDate: Optional[str] = None
    labels: list[str]
    progress: int
    subtasks: list
    createdAt: str
    updatedAt: str

    model_config = {
        "from_attributes": True
    }

    @classmethod
    def from_model(cls, task):
        created_at = getattr(task, "created_at", None)
        updated_at = getattr(task, "updated_at", created_at)
        status = getattr(task, "status", "pending")
        priority = getattr(task, "priority", "medium")
        progress = getattr(task, "progress", 0)

        return cls(
            id=str(task.task_id),
            title=task.task_title,
            description=getattr(task, "description", None),
            status=status,
            priority=priority,
            dueDate=task.scheduled_date.isoformat()
            if getattr(task, "scheduled_date", None)
            else None,
            labels=[],
            progress=progress,
            subtasks=[],
            createdAt=created_at.isoformat() if created_at else "",
            updatedAt=updated_at.isoformat() if updated_at else "",
        )