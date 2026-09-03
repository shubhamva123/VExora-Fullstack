from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import Time
from datetime import datetime
from app.database.base import Base
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Numeric,
)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    tasks = relationship("Task", back_populates="user")
    notes = relationship("Note", back_populates="user")
    chats = relationship("ChatMessage", back_populates="user")
    daily_logs = relationship("DailyLog", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    study_sessions = relationship("StudySession", back_populates="user")
    ai_memories = relationship("AiMemory", back_populates="user")
    calendar_events = relationship(
        "CalendarEvent",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)

    # Personal task owner
    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=True,
    )

    # Group task owner
    group_id = Column(
        Integer,
        ForeignKey("groups.group_id"),
        nullable=True,
    )

    task_title = Column(String(255), nullable=False)

    description = Column(
        Text,
        nullable=True,
    )

    priority = Column(
        String(20),
        nullable=False,
        default="medium",
    )

    category = Column(
        String(50),
        nullable=True,
    )

    status = Column(
        String(20),
        default="pending",
    )

    scheduled_date = Column(
        Date,
        nullable=False,
    )

    due_time = Column(
        Time,
        nullable=True,
    )

    completed_at = Column(
        DateTime,
        nullable=True,
    )

    progress = Column(
        Integer,
        nullable=False,
        default=0,
    )

    estimated_minutes = Column(
        Integer,
        nullable=True,
    )

    actual_minutes = Column(
        Integer,
        nullable=True,
    )

    reminder_at = Column(
        DateTime,
        nullable=True,
    )

    repeat_type = Column(
        String(20),
        nullable=True,
    )

    parent_task_id = Column(
        Integer,
        ForeignKey("tasks.task_id"),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = relationship(
        "User",
        back_populates="tasks",
    )

    group = relationship(
    "Group",
    foreign_keys=[group_id],
    ) 


class DailyLog(Base):
    __tablename__ = "daily_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    log_date = Column(Date, nullable=False)
    ai_summary = Column(Text)
    worth_score = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="daily_logs")


class Goal(Base):
    __tablename__ = "goals"

    goal_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="goals")


class StudySession(Base):
    __tablename__ = "study_sessions"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    topic = Column(String(255), nullable=True)
    duration_minutes = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="study_sessions")


class AiMemory(Base):
    __tablename__ = "ai_memory"

    memory_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    memory_type = Column(String(50), nullable=False, default="note")
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    importance = Column(Integer, default=1)
    source = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="ai_memories")


class Note(Base):
    __tablename__ = "notes"

    note_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    title = Column(String(150), nullable=False)
    content = Column(Text)
    is_for_revision = Column(Boolean, default=False)
    next_revision_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="notes")
    files = relationship("FileUpload", back_populates="note")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    log_date = Column(Date, nullable=False)
    sender = Column(String(10))
    message_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="chats")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    event_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text)

    event_type = Column(String(30))
    event_date = Column(Date)

    start_time = Column(Time)
    end_time = Column(Time)

    status = Column(String(30))
    priority = Column(String(20))

    task_id = Column(Integer, ForeignKey("tasks.task_id"), nullable=True)
    note_id = Column(Integer, ForeignKey("notes.note_id"), nullable=True)
    revision_id = Column(Integer, nullable=True)

    location = Column(String(255))
    color = Column(String(20))

    is_all_day = Column(Boolean, default=False)
    reminder_minutes = Column(Integer, default=30)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = relationship("User", back_populates="calendar_events")

    @property
    def start_datetime(self):
        if self.event_date and self.start_time:
            return datetime.combine(self.event_date, self.start_time)
        return None

    @property
    def end_datetime(self):
        if self.event_date and self.end_time:
            return datetime.combine(self.event_date, self.end_time)
        return None


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    is_read = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="notifications",
    )

class RevisionSchedule(Base):
    __tablename__ = "revision_schedule"

    revision_id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
    )

    note_id = Column(
        Integer,
        ForeignKey("notes.note_id"),
        nullable=False,
    )

    revision_number = Column(
        Integer,
        default=1,
    )

    scheduled_date = Column(
        Date,
        nullable=False,
    )

    completed_date = Column(
        DateTime,
        nullable=True,
    )

    status = Column(
        String(20),
        default="pending",
    )

    interval_days = Column(
        Integer,
        default=1,
    )

    ease_factor = Column(
        # use Numeric if you already import it
        Numeric(4, 2),
        default=2.50,
    )

    quality_score = Column(
        Integer,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
    )
class FileUpload(Base):
    __tablename__ = "file_uploads"

    file_id = Column(Integer, primary_key=True, index=True)
    note_id = Column(Integer, ForeignKey("notes.note_id"))
    file_name = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=False)
    file_type = Column(String(10), nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now())

    note = relationship("Note", back_populates="files")
    extracted_content = relationship(
        "FileContentExtracted",
        back_populates="file",
        cascade="all, delete-orphan",
    )


class FileContentExtracted(Base):
    __tablename__ = "file_content_extracted"

    content_id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("file_uploads.file_id"))
    page_number = Column(Integer)
    extracted_text = Column(Text, nullable=False)

    file = relationship("FileUpload", back_populates="extracted_content")

class Group(Base):
    __tablename__ = "groups"

    group_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    created_by = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
    )
    created_at = Column(
        DateTime,
        server_default=func.now(),
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by],
    )

class GroupMember(Base):
    __tablename__ = "group_members"

    membership_id = Column(Integer, primary_key=True, index=True)

    group_id = Column(
        Integer,
        ForeignKey("groups.group_id"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
    )

    role = Column(
        String(30),
        nullable=False,
        default="member",
    )

    position_name = Column(
        String(100),
        nullable=True,
    )

    joined_at = Column(
        DateTime,
        server_default=func.now(),
    )

    group = relationship("Group")

    user = relationship("User") 
    