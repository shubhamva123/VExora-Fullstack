export type ThemeMode = "light" | "dark";

export interface User {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  role?: "owner" | "admin" | "member" | "guest";
  bio?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Attachment {
  id: number;
  name: string;
  type: "pdf" | "doc" | "image" | "audio" | "sheet" | "slides" | "other";
  size?: number;
  url?: string;
}

export interface Note {
  id?: string | number;
  note_id?: number;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  attachments?: Attachment[];
  revisionDue?: string;
  user_id?: number;
  is_for_revision?: boolean;
  next_revision_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "todo"
  | "in-progress"
  | "review"
  | "done";

export interface Task {
  id?: string | number;
  task_id?: number;
  title?: string;
  task_title?: string;
  description?: string;
  status: TaskStatus;
  priority?: string;
  dueDate?: string;
  scheduled_date?: string;
  labels?: string[];
  progress?: number;
  subtasks?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarEvent {
  id?: string | number;
  event_id?: number;
  user_id?: number;

  title: string;
  description?: string;

  event_type?: string;
  type?: string;

  start_datetime?: string;
  end_datetime?: string | null;
  startTime?: string;
  endTime?: string;
  date?: string;

  location?: string | null;

  is_all_day?: boolean;
  allDay?: boolean;

  reminder_minutes?: number;

  color?: string;

  created_at?: string;
  updated_at?: string;
}

export interface RevisionItem {
  id: string;
  title: string;
  subject: string;
  scheduledDate: string;
  completed: boolean;
  interval: number;
  lastReviewed?: string;
  nextReview?: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: "info" | "success" | "warning" | "task" | "revision" | "ai";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
    aiSuggestions: boolean;
  };
  ai: {
    model: string;
    creativity: number;
    autoSummarize: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: "small" | "medium" | "large";
  };
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface AnalyticsDataPoint {
  label: string;
  value: number;
}

export interface ActivitySeries {
  name: string;
  data: AnalyticsDataPoint[];
  color?: string;
}