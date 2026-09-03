from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import User
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
)
from app.services.task_service import (
    create_task,
    get_tasks,
    get_task,
    update_task,
    delete_task,
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.get("/", response_model=list[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = get_tasks(db, current_user.user_id)
    return [TaskResponse.from_model(task) for task in tasks]


@router.post("/", response_model=TaskResponse)
def add_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    created = create_task(
        db=db,
        user_id=current_user.user_id,
        task_title=task.task_title,
        description=task.description,
        priority=task.priority,
        scheduled_date=task.scheduled_date,
    )
    return TaskResponse.from_model(created)


@router.get("/{task_id}", response_model=TaskResponse)
def get_single_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task(db, task_id, current_user.user_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskResponse.from_model(task)


@router.patch("/{task_id}", response_model=TaskResponse)
def edit_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task(db, task_id, current_user.user_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    data = payload.model_dump(exclude_unset=True)

    for key, value in data.items():
        setattr(task, key, value)

    updated = update_task(db, task)
    return TaskResponse.from_model(updated)

@router.delete("/{task_id}")
def remove_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_task(db, task_id, current_user.user_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    delete_task(db, task)

    return {"message": "Task deleted successfully"}