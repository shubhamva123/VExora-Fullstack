from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database.connection import get_db
from app.database.models import (
    User,
    Task,
    Note,
    CalendarEvent,
    ChatMessage,
    DailyLog,
    Goal,
    StudySession,
    RevisionSchedule,
    AiMemory,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.get("/context")
def get_ai_context(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_id = current_user.user_id

    tasks = (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .all()
    )

    notes = (
        db.query(Note)
        .filter(Note.user_id == user_id)
        .all()
    )

    calendar_events = (
        db.query(CalendarEvent)
        .filter(CalendarEvent.user_id == user_id)
        .all()
    )

    chat_messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(20)
        .all()
    )

    daily_logs = (
        db.query(DailyLog)
        .filter(DailyLog.user_id == user_id)
        .order_by(DailyLog.log_date.desc())
        .limit(10)
        .all()
    )

    goals = (
        db.query(Goal)
        .filter(Goal.user_id == user_id)
        .all()
    )

    study_sessions = (
        db.query(StudySession)
        .filter(StudySession.user_id == user_id)
        .order_by(StudySession.created_at.desc())
        .limit(20)
        .all()
    )

    revisions = (
        db.query(RevisionSchedule)
        .filter(RevisionSchedule.user_id == user_id)
        .all()
    )

    memories = (
        db.query(AiMemory)
        .filter(AiMemory.user_id == user_id)
        .order_by(AiMemory.importance.desc())
        .limit(50)
        .all()
    )

    return {
        "user": {
            "id": current_user.user_id,
            "username": current_user.username,
            "email": current_user.email,
        },

        "tasks": [
            {
                "id": task.task_id,
                "title": task.task_title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "scheduled_date": (
                    task.scheduled_date.isoformat()
                    if task.scheduled_date
                    else None
                ),
                "progress": task.progress,
            }
            for task in tasks
        ],

        "notes": [
            {
                "id": note.note_id,
                "title": note.title,
                "content": note.content,
            }
            for note in notes
        ],

        "calendar_events": [
            {
                "id": event.event_id,
                "title": event.title,
                "description": event.description,
                "date": (
                    event.event_date.isoformat()
                    if event.event_date
                    else None
                ),
                "start_time": (
                    event.start_time.isoformat()
                    if event.start_time
                    else None
                ),
                "end_time": (
                    event.end_time.isoformat()
                    if event.end_time
                    else None
                ),
                "status": event.status,
                "priority": event.priority,
            }
            for event in calendar_events
        ],

        "chat_history": [
            {
                "id": message.message_id,
                "sender": message.sender,
                "message": message.message_text,
                "created_at": (
                    message.created_at.isoformat()
                    if message.created_at
                    else None
                ),
            }
            for message in chat_messages
        ],

        "daily_logs": [
            {
                "date": (
                    log.log_date.isoformat()
                    if log.log_date
                    else None
                ),
                "summary": log.ai_summary,
                "worth_score": log.worth_score,
            }
            for log in daily_logs
        ],

        "goals": [
            {
                "id": goal.goal_id,
                "title": goal.title,
            }
            for goal in goals
        ],

        "study_sessions": [
            {
                "id": session.session_id,
                "created_at": (
                    session.created_at.isoformat()
                    if session.created_at
                    else None
                ),
            }
            for session in study_sessions
        ],

        "revisions": [
            {
                "id": revision.revision_id,
                "note_id": revision.note_id,
                "revision_number": revision.revision_number,
                "scheduled_date": (
                    revision.scheduled_date.isoformat()
                    if revision.scheduled_date
                    else None
                ),
                "status": revision.status,
                "interval_days": revision.interval_days,
                "ease_factor": revision.ease_factor,
                "quality_score": revision.quality_score,
            }
            for revision in revisions
        ],

        "ai_memory": [
            {
                "id": memory.memory_id,
                "type": memory.memory_type,
                "title": memory.title,
                "content": memory.content,
                "importance": memory.importance,
                "source": memory.source,
            }
            for memory in memories
        ],
    }