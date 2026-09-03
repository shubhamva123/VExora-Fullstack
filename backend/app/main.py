from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Literal

from fastapi import FastAPI, Header, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

APP_TITLE = "VExora API"
APP_VERSION = "1.0.0"

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|10\.97\.130\.169)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return utc_now().isoformat().replace("+00:00", "Z")


DEFAULT_USER = {
    "id": 1,
    "username": "demo_user",
    "email": "demo@vexora.ai",
    "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    "role": "owner",
    "bio": "Productivity-focused student building systems that stick.",
    "createdAt": "2026-08-01T08:30:00Z",
}


NOTES = [
    {
        "note_id": 1,
        "user_id": 1,
        "title": "Physics Revision Outline",
        "content": "Review momentum conservation, derive equations and solve 5 practice problems before Friday.",
        "is_for_revision": True,
        "next_revision_date": "2026-08-05T09:00:00Z",
        "created_at": "2026-08-01T09:00:00Z",
        "updated_at": "2026-08-02T07:00:00Z",
    },
    {
        "note_id": 2,
        "user_id": 1,
        "title": "Essay Brainstorm",
        "content": "Add relation between theory and practical examples. Keep citations consistent.",
        "is_for_revision": False,
        "next_revision_date": None,
        "created_at": "2026-08-01T12:15:00Z",
        "updated_at": "2026-08-02T11:00:00Z",
    },
]


TASKS = [
    {
        "id": "task-1",
        "user_id": 1,
        "title": "Finish chemistry lab report",
        "description": "Compile the results and final discussion section.",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2026-08-04T18:00:00Z",
        "labels": ["Science", "Urgent"],
        "progress": 72,
        "subtasks": [],
        "createdAt": "2026-08-01T08:00:00Z",
        "updatedAt": "2026-08-02T09:15:00Z",
    },
    {
        "id": "task-2",
        "user_id": 1,
        "title": "Prepare math flashcards",
        "description": "Focus on derivative rules and integration tips.",
        "status": "pending",
        "priority": "medium",
        "dueDate": "2026-08-03T16:00:00Z",
        "labels": ["Math"],
        "progress": 35,
        "subtasks": [],
        "createdAt": "2026-08-01T10:30:00Z",
        "updatedAt": "2026-08-02T08:45:00Z",
    },
]


CALENDAR_EVENTS = [
    {
        "event_id": 1,
        "user_id": 1,
        "title": "Revision Block",
        "description": "Biology topic revision cluster.",
        "event_type": "revision",
        "start_datetime": "2026-08-03T09:00:00Z",
        "end_datetime": "2026-08-03T11:00:00Z",
        "location": "Study room",
        "is_all_day": False,
        "reminder_minutes": 30,
        "color": "#8b5cf6",
        "created_at": "2026-08-01T06:00:00Z",
        "updated_at": "2026-08-01T06:00:00Z",
    },
    {
        "event_id": 2,
        "user_id": 1,
        "title": "Project checkpoint",
        "description": "Review delivery checklist and blockers.",
        "event_type": "task",
        "start_datetime": "2026-08-05T15:30:00Z",
        "end_datetime": "2026-08-05T16:30:00Z",
        "location": "Zoom",
        "is_all_day": False,
        "reminder_minutes": 15,
        "color": "#38bdf8",
        "created_at": "2026-08-01T09:00:00Z",
        "updated_at": "2026-08-01T09:00:00Z",
    },
]


REVISIONS = [
    {
        "id": "rev-1",
        "user_id": 1,
        "title": "Calculus recall sprint",
        "subject": "Mathematics",
        "scheduledDate": "2026-08-04T10:00:00Z",
        "completed": False,
        "interval": 3,
        "lastReviewed": "2026-07-28T09:00:00Z",
        "nextReview": "2026-08-04T10:00:00Z",
        "progress": 68,
    },
    {
        "id": "rev-2",
        "user_id": 1,
        "title": "Biology terminology pack",
        "subject": "Biology",
        "scheduledDate": "2026-08-06T10:00:00Z",
        "completed": True,
        "interval": 2,
        "lastReviewed": "2026-08-01T14:00:00Z",
        "nextReview": "2026-08-06T10:00:00Z",
        "progress": 100,
    },
]


CONVERSATIONS = [
    {
        "id": "conversation-1",
        "title": "Study planning",
        "messages": [
            {
                "id": "m-1",
                "role": "user",
                "content": "Can you help me organize my revision for this week?",
                "createdAt": "2026-08-02T07:30:00Z",
            },
            {
                "id": "m-2",
                "role": "assistant",
                "content": "Absolutely — focus on high-priority topics, schedule active recall blocks, and cap sessions at 50 minutes with short breaks.",
                "createdAt": "2026-08-02T07:31:00Z",
            },
        ],
        "pinned": True,
        "createdAt": "2026-08-02T07:30:00Z",
        "updatedAt": "2026-08-02T07:31:00Z",
    }
]


NOTIFICATIONS = [
    {
        "id": "notification-1",
        "type": "revision",
        "title": "Revision due soon",
        "message": "Calculus recall sprint is scheduled for tomorrow morning.",
        "read": False,
        "createdAt": "2026-08-02T06:00:00Z",
        "actionUrl": "/app/revision",
    },
    {
        "id": "notification-2",
        "type": "task",
        "title": "Deadline approaching",
        "message": "Chemistry lab report needs final review before 6 PM.",
        "read": True,
        "createdAt": "2026-08-01T18:30:00Z",
        "actionUrl": "/app/tasks",
    },
]

DEFAULT_SYSTEM_PROMPT = (
    "You are VExora, an AI academic advisor. Use the user’s current study tasks, notes, calendar events, "
    "and revision context to provide concise, actionable guidance that keeps the user focused. Stay user-centered, "
    "suggest next steps, and do not expose any data belonging to other users."
)

AI_PROFILES = [
    {
        "user_id": 1,
        "assistant_name": "VExora Adviser",
        "system_prompt": DEFAULT_SYSTEM_PROMPT,
        "preferences": {"tone": "supportive", "focus": "study_plan"},
        "is_active": True,
        "created_at": "2026-08-01T08:30:00Z",
        "updated_at": "2026-08-01T08:30:00Z",
    }
]

AI_JOBS: list[dict[str, Any]] = []


def require_auth(authorization: str | None) -> dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")
    if token != "demo-token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return DEFAULT_USER


def get_ai_profile(user_id: int) -> dict[str, Any]:
    for profile in AI_PROFILES:
        if profile["user_id"] == user_id:
            return profile
    return {
        "user_id": user_id,
        "assistant_name": "VExora Adviser",
        "system_prompt": DEFAULT_SYSTEM_PROMPT,
        "preferences": {"tone": "supportive", "focus": "study_plan"},
        "is_active": True,
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }


def build_ai_context(user_id: int) -> dict[str, Any]:
    tasks = [task for task in TASKS if task.get("user_id", 1) == user_id]
    notes = [note for note in NOTES if note.get("user_id", 1) == user_id]
    events = [event for event in CALENDAR_EVENTS if event.get("user_id", 1) == user_id]
    revisions = [revision for revision in REVISIONS if revision.get("user_id", 1) == user_id]
    chat_history = []
    for conversation in CONVERSATIONS:
        for message in conversation["messages"]:
            chat_history.append(
                {
                    "role": message["role"],
                    "content": message["content"],
                    "createdAt": message["createdAt"],
                }
            )
    return {
        "tasks": tasks,
        "notes": notes,
        "calendar_events": events,
        "revisions": revisions,
        "chat_history": chat_history,
    }


def summarize_context(context: dict[str, Any]) -> str:
    tasks = context["tasks"]
    notes = context["notes"]
    events = context["calendar_events"]
    revisions = context["revisions"]
    summary_parts: list[str] = []

    pending_tasks = [task for task in tasks if task.get("status") in {"pending", "in_progress"}]
    if pending_tasks:
        summary_parts.append(
            f"You have {len(pending_tasks)} tasks in progress or pending, including '{pending_tasks[0].get('title')}'."
        )
    if events:
        summary_parts.append(f"Your next calendar event is '{events[0].get('title')}' at {events[0].get('start_datetime')}."
        )
    if notes:
        summary_parts.append(f"You have {len(notes)} notes; the latest is '{notes[0].get('title')}'.")
    if revisions:
        active = [rev for rev in revisions if not rev.get("completed")]
        if active:
            summary_parts.append(
                f"You are currently revising '{active[0].get('title')}' with {active[0].get('progress', 0)}% progress."
            )
    if not summary_parts:
        return "You have no active study items."
    return " ".join(summary_parts)


def generate_ai_response(message: str, context: dict[str, Any], system_prompt: str) -> str:
    lower = message.lower()
    if "schedule" in lower or "plan" in lower or "tomorrow" in lower:
        return (
            "Based on your current workload, I recommend starting with your highest-priority task, "
            "then blocking 45 minutes for revision. Keep the evening for a short recapitulation of what you learned."
        )
    if "task" in lower or "prioritize" in lower:
        return (
            "Focus on the item due soonest first. Right now, that looks like the chemistry lab report; "
            "follow it with the math flashcards session so you keep momentum through the day."
        )
    if "summar" in lower or "overview" in lower:
        return summarize_context(context)
    if "recommend" in lower or "advice" in lower or "what should i" in lower:
        return (
            "I recommend a study block for your most urgent topic, then a quick revision review. "
            "If you can, review the latest note titled 'Physics Revision Outline' after your first task."
        )
    return (
        f"{system_prompt} Here is a suggested next step: review your current pending task list, "
        "select one clear priority, and use a focused sprint to make measurable progress."
    )


def queue_ai_job(user_id: int, job_type: str, parameters: dict[str, Any]) -> dict[str, Any]:
    job_id = len(AI_JOBS) + 1
    job = {
        "job_id": job_id,
        "user_id": user_id,
        "job_type": job_type,
        "parameters": parameters,
        "status": "queued",
        "result": None,
        "error": None,
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }
    AI_JOBS.append(job)
    return job


class LoginPayload(BaseModel):
    email: str
    password: str


class RegisterPayload(BaseModel):
    username: str
    email: str
    password: str


class ProfileUpdatePayload(BaseModel):
    username: str | None = None
    email: str | None = None
    bio: str | None = None
    role: Literal["owner", "admin", "member", "guest"] | None = None
    avatarUrl: str | None = None


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "service": "vexora-api"}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "VExora API is running"}


@app.post("/api/auth/login")
def login(payload: LoginPayload) -> dict[str, str]:
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return {"access_token": "demo-token", "token_type": "bearer"}


@app.post("/api/auth/register")
def register(payload: RegisterPayload) -> dict[str, str]:
    if not payload.username or not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Username, email, and password are required")
    return {"message": "User created successfully"}


@app.post("/api/auth/forgot-password")
def forgot_password(payload: dict[str, str]) -> dict[str, str]:
    return {"message": "Password reset link sent"}


@app.post("/api/auth/reset-password")
def reset_password(payload: dict[str, str]) -> dict[str, str]:
    return {"message": "Password reset successful"}


@app.post("/api/auth/logout")
def logout() -> dict[str, str]:
    return {"message": "Logged out"}


@app.get("/api/auth/me")
def get_profile(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = require_auth(authorization)
    return user


@app.patch("/api/auth/me")
def update_profile(payload: ProfileUpdatePayload, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = require_auth(authorization)
    for field, value in payload.model_dump(exclude_none=True).items():
        user[field] = value
    return user


class AIChatPayload(BaseModel):
    message: str


class AISummaryPayload(BaseModel):
    date: str | None = None


class AIRecommendationsPayload(BaseModel):
    question: str


class AIEmbeddingsPayload(BaseModel):
    file_id: int | None = None


@app.get("/api/ai/context")
def get_ai_context(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = require_auth(authorization)
    context = build_ai_context(user["id"])
    profile = get_ai_profile(user["id"])
    return {
        "user": {"id": user["id"], "username": user["username"]},
        "ai_profile": {
            "assistant_name": profile["assistant_name"],
            "preferences": profile["preferences"],
            "is_active": profile["is_active"],
        },
        "tasks": context["tasks"],
        "notes": context["notes"],
        "calendar_events": context["calendar_events"],
        "revisions": context["revisions"],
        "chat_history": context["chat_history"],
    }


@app.post("/api/ai/chat")
def chat_with_ai(payload: AIChatPayload, authorization: str | None = Header(default=None)) -> dict[str, str]:
    user = require_auth(authorization)
    profile = get_ai_profile(user["id"])
    context = build_ai_context(user["id"])
    reply = generate_ai_response(payload.message, context, profile["system_prompt"])
    return {"reply": reply}


@app.post("/api/ai/summary")
def summarize_activity(payload: AISummaryPayload, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = require_auth(authorization)
    context = build_ai_context(user["id"])
    summary = summarize_context(context)
    return {"summary": summary, "worth_score": 0.83}


@app.post("/api/ai/recommendations")
def ai_recommendations(payload: AIRecommendationsPayload, authorization: str | None = Header(default=None)) -> dict[str, str]:
    user = require_auth(authorization)
    context = build_ai_context(user["id"])
    reply = generate_ai_response(payload.question, context, DEFAULT_SYSTEM_PROMPT)
    return {"advice": reply}


@app.post("/api/ai/embeddings")
def create_embedding_job(payload: AIEmbeddingsPayload, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = require_auth(authorization)
    if payload.file_id is None:
        raise HTTPException(status_code=400, detail="file_id is required")
    job = queue_ai_job(user["id"], "embed", {"file_id": payload.file_id})
    return {"status": job["status"], "job_id": job["job_id"]}


@app.get("/api/notes")
def list_notes(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return NOTES


@app.post("/api/notes")
def create_note(payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    item = {
        "note_id": len(NOTES) + 1,
        "user_id": 1,
        "title": payload.get("title", "Untitled note"),
        "content": payload.get("content", ""),
        "is_for_revision": bool(payload.get("is_for_revision", False)),
        "next_revision_date": payload.get("next_revision_date"),
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }
    NOTES.insert(0, item)
    return item


@app.patch("/api/notes/{note_id}")
def update_note(note_id: int, payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for note in NOTES:
        if note["note_id"] == note_id:
            note.update(payload)
            note["updated_at"] = iso_now()
            return note
    raise HTTPException(status_code=404, detail="Note not found")


@app.delete("/api/notes/{note_id}")
def delete_note(note_id: int, authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for idx, note in enumerate(NOTES):
        if note["note_id"] == note_id:
            NOTES.pop(idx)
            return {"message": "Note deleted"}
    raise HTTPException(status_code=404, detail="Note not found")


@app.get("/api/tasks")
def list_tasks(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return TASKS


@app.get("/api/tasks/{task_id}")
def get_task(task_id: int, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for task in TASKS:
        if str(task_id) in task.get("id", "") or task.get("id") == str(task_id):
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.post("/api/tasks")
def create_task(payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    item = {
        "id": f"task-{len(TASKS) + 1}",
        "title": payload.get("task_title") or payload.get("title") or "New task",
        "description": payload.get("description", ""),
        "status": payload.get("status", "pending"),
        "priority": payload.get("priority", "medium"),
        "dueDate": payload.get("scheduled_date") or payload.get("dueDate"),
        "labels": payload.get("labels", []),
        "progress": payload.get("progress", 0),
        "subtasks": payload.get("subtasks", []),
        "createdAt": iso_now(),
        "updatedAt": iso_now(),
    }
    TASKS.insert(0, item)
    return item


@app.patch("/api/tasks/{task_id}")
def update_task(task_id: int, payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for task in TASKS:
        if str(task_id) == task.get("id").replace("task-", "") or task.get("id") == str(task_id):
            task.update(payload)
            task["updatedAt"] = iso_now()
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for idx, task in enumerate(TASKS):
        if str(task_id) == task.get("id").replace("task-", "") or task.get("id") == str(task_id):
            TASKS.pop(idx)
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/api/calendar")
def list_calendar(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return CALENDAR_EVENTS


@app.get("/api/calendar/{event_id}")
def get_calendar_event(event_id: int, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for event in CALENDAR_EVENTS:
        if event["event_id"] == event_id:
            return event
    raise HTTPException(status_code=404, detail="Event not found")


@app.post("/api/calendar")
def create_calendar_event(payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    event = {
        "event_id": len(CALENDAR_EVENTS) + 1,
        "user_id": 1,
        "title": payload.get("title", "New event"),
        "description": payload.get("description"),
        "event_type": payload.get("type") or payload.get("event_type") or "study",
        "start_datetime": payload.get("start_datetime") or payload.get("date", iso_now()),
        "end_datetime": payload.get("end_datetime") or payload.get("endTime"),
        "location": payload.get("location"),
        "is_all_day": bool(payload.get("is_all_day", False)),
        "reminder_minutes": int(payload.get("reminder_minutes") or 15),
        "color": payload.get("color") or "#38bdf8",
        "created_at": iso_now(),
        "updated_at": iso_now(),
    }
    CALENDAR_EVENTS.insert(0, event)
    return event


@app.patch("/api/calendar/{event_id}")
def update_calendar_event(event_id: int, payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for event in CALENDAR_EVENTS:
        if event["event_id"] == event_id:
            event.update(payload)
            event["updated_at"] = iso_now()
            return event
    raise HTTPException(status_code=404, detail="Event not found")


@app.delete("/api/calendar/{event_id}")
def delete_calendar_event(event_id: int, authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for idx, event in enumerate(CALENDAR_EVENTS):
        if event["event_id"] == event_id:
            CALENDAR_EVENTS.pop(idx)
            return {"message": "Event deleted"}
    raise HTTPException(status_code=404, detail="Event not found")


@app.get("/api/dashboard")
def get_dashboard(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    return {
        "stats": {
            "total_notes": len(NOTES),
            "total_tasks": len(TASKS),
            "pending_tasks": sum(1 for task in TASKS if task["status"] in {"pending", "in_progress"}),
            "completed_tasks": sum(1 for task in TASKS if task["status"] == "completed"),
            "completion_rate": 76,
            "overdue_tasks": 2,
            "today_tasks": 4,
            "high_priority_tasks": sum(1 for task in TASKS if task["priority"] in {"high", "urgent"}),
            "revision_notes": sum(1 for n in NOTES if n["is_for_revision"]),
            "calendar_events": len(CALENDAR_EVENTS),
        },
        "recent_tasks": [
            {"id": task["id"], "title": task["title"], "status": task["status"], "priority": task["priority"], "progress": task["progress"]}
            for task in TASKS[:3]
        ],
        "recent_notes": [
            {"id": note["note_id"], "title": note["title"], "is_for_revision": note["is_for_revision"]}
            for note in NOTES[:3]
        ],
    }


@app.get("/api/chat")
def get_chat_history(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    result = []
    for conversation in CONVERSATIONS:
        for message in conversation["messages"]:
            result.append(
                {
                    "message_id": len(result) + 1,
                    "sender": message["role"],
                    "message_text": message["content"],
                    "log_date": message["createdAt"],
                }
            )
    return result


@app.post("/api/chat")
def send_chat_message(payload: dict[str, str], authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    message = payload.get("message", "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message content is required")
    prompt = message.lower()
    if "schedule" in prompt or "plan" in prompt:
        reply = "I suggest a 45-minute focus block tomorrow morning, then a 20-minute recap in the evening."
    elif "task" in prompt or "prioritize" in prompt:
        reply = "Start with the chemistry lab report, then complete the math flashcards before the evening review block."
    else:
        reply = "Here is a focused action: break the work into one clear priority, execute a short 25-minute sprint, and review your progress before moving on."
    return {"reply": reply}


@app.get("/api/chat/conversations")
def list_conversations(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return CONVERSATIONS


@app.get("/api/chat/conversations/{conversation_id}")
def get_conversation(conversation_id: str, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for conversation in CONVERSATIONS:
        if conversation["id"] == conversation_id:
            return conversation
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.post("/api/chat/conversations")
def create_conversation(payload: dict[str, Any] | None = None, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    title = (payload or {}).get("title") or "New conversation"
    conversation = {
        "id": f"conversation-{len(CONVERSATIONS) + 1}",
        "title": title,
        "messages": [],
        "pinned": False,
        "createdAt": iso_now(),
        "updatedAt": iso_now(),
    }
    CONVERSATIONS.insert(0, conversation)
    return conversation


@app.patch("/api/chat/conversations/{conversation_id}")
def rename_conversation(conversation_id: str, payload: dict[str, str], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for conversation in CONVERSATIONS:
        if conversation["id"] == conversation_id:
            conversation["title"] = payload.get("title") or conversation["title"]
            conversation["updatedAt"] = iso_now()
            return conversation
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.delete("/api/chat/conversations/{conversation_id}")
def delete_conversation(conversation_id: str, authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for idx, conversation in enumerate(CONVERSATIONS):
        if conversation["id"] == conversation_id:
            CONVERSATIONS.pop(idx)
            return {"message": "Conversation deleted"}
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.post("/api/chat/conversations/{conversation_id}/pin")
def toggle_pin(conversation_id: str, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for conversation in CONVERSATIONS:
        if conversation["id"] == conversation_id:
            conversation["pinned"] = not conversation["pinned"]
            conversation["updatedAt"] = iso_now()
            return conversation
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.post("/api/chat/conversations/{conversation_id}/messages")
def send_conversation_message(conversation_id: str, payload: dict[str, str], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    content = payload.get("content", "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message content is required")
    for conversation in CONVERSATIONS:
        if conversation["id"] == conversation_id:
            user_message = {
                "id": f"m-{len(conversation['messages']) + 1}",
                "role": "user",
                "content": content,
                "createdAt": iso_now(),
            }
            assistant_message = {
                "id": f"m-{len(conversation['messages']) + 2}",
                "role": "assistant",
                "content": "I’ve saved that note and summarized the action: break it into one immediate priority and one follow-up review.",
                "createdAt": iso_now(),
            }
            conversation["messages"].extend([user_message, assistant_message])
            conversation["updatedAt"] = iso_now()
            return assistant_message
    raise HTTPException(status_code=404, detail="Conversation not found")


@app.get("/api/notifications")
def list_notifications(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return NOTIFICATIONS


@app.post("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for notification in NOTIFICATIONS:
        if notification["id"] == notification_id:
            notification["read"] = True
            return {"message": "Notification marked as read"}
    raise HTTPException(status_code=404, detail="Notification not found")


@app.post("/api/notifications/read-all")
def mark_all_notifications_read(authorization: str | None = Header(default=None)) -> dict[str, str]:
    require_auth(authorization)
    for notification in NOTIFICATIONS:
        notification["read"] = True
    return {"message": "All notifications marked as read"}


@app.get("/api/analytics/weekly")
def weekly_analytics(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return [
        {"label": "Mon", "value": 72},
        {"label": "Tue", "value": 65},
        {"label": "Wed", "value": 88},
        {"label": "Thu", "value": 91},
        {"label": "Fri", "value": 77},
        {"label": "Sat", "value": 83},
        {"label": "Sun", "value": 94},
    ]


@app.get("/api/analytics/monthly")
def monthly_analytics(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return [
        {"label": "Jan", "value": 62},
        {"label": "Feb", "value": 68},
        {"label": "Mar", "value": 72},
        {"label": "Apr", "value": 75},
        {"label": "May", "value": 80},
        {"label": "Jun", "value": 85},
        {"label": "Jul", "value": 89},
        {"label": "Aug", "value": 92},
    ]


@app.get("/api/analytics/series")
def analytics_series(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return [
        {
            "name": "Focus",
            "color": "#8b5cf6",
            "data": [
                {"label": "Mon", "value": 72},
                {"label": "Tue", "value": 76},
                {"label": "Wed", "value": 82},
                {"label": "Thu", "value": 86},
                {"label": "Fri", "value": 78},
            ],
        },
        {
            "name": "Tasks",
            "color": "#22c55e",
            "data": [
                {"label": "Mon", "value": 48},
                {"label": "Tue", "value": 53},
                {"label": "Wed", "value": 66},
                {"label": "Thu", "value": 71},
                {"label": "Fri", "value": 80},
            ],
        },
    ]


@app.get("/api/summary/daily")
def daily_summary(date: str | None = Query(default=None), authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    selected_date = date or "2026-08-02"
    return {
        "date": selected_date,
        "focusScore": 88,
        "highlights": [
            "Completed one deep-work session in the morning.",
            "Reviewed 3 high-priority tasks before noon.",
            "Scheduled the next revision block for tomorrow.",
        ],
        "insights": [
            {"title": "Momentum", "detail": "You are pacing ahead of last week."},
            {"title": "Priority", "detail": "Focus on the chemistry lab report before evening study work."},
        ],
    }


@app.get("/api/revisions")
def list_revisions(authorization: str | None = Header(default=None)) -> list[dict[str, Any]]:
    require_auth(authorization)
    return REVISIONS


@app.post("/api/revisions")
def create_revision(payload: dict[str, Any], authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    item = {
        "id": f"rev-{len(REVISIONS) + 1}",
        "title": payload.get("title", "New revision item"),
        "subject": payload.get("subject", "General"),
        "scheduledDate": payload.get("scheduledDate") or iso_now(),
        "completed": False,
        "interval": int(payload.get("interval", 1)),
        "lastReviewed": payload.get("lastReviewed"),
        "nextReview": payload.get("nextReview") or payload.get("scheduledDate") or iso_now(),
        "progress": int(payload.get("progress", 0)),
    }
    REVISIONS.insert(0, item)
    return item


@app.post("/api/revisions/{revision_id}/complete")
def complete_revision(revision_id: str, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    require_auth(authorization)
    for revision in REVISIONS:
        if revision["id"] == revision_id:
            revision["completed"] = True
            revision["progress"] = 100
            revision["nextReview"] = iso_now()
            return revision
    raise HTTPException(status_code=404, detail="Revision not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
