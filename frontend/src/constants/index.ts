export const APP_NAME = 'VExora';
export const APP_TAGLINE = 'AI-Powered Productivity Platform';
export const APP_DESCRIPTION =
  'VExora helps you capture notes, manage tasks, plan revisions, and study smarter with AI assistance.';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
export const STORAGE_KEYS = {
  theme: 'vexora.theme',
  sidebarCollapsed: 'vexora.sidebar.collapsed',
  recentSearches: 'vexora.search.recent',
  preferences: 'vexora.preferences',
} as const;

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/app/dashboard', icon: 'LayoutDashboard' },
  { label: 'Notes', path: '/app/notes', icon: 'StickyNote' },
  { label: 'Tasks', path: '/app/tasks', icon: 'CheckSquare' },
  { label: 'Calendar', path: '/app/calendar', icon: 'Calendar' },
  { label: 'AI Chat', path: '/app/ai-chat', icon: 'MessageSquare' },
  { label: 'Revision Planner', path: '/app/revision', icon: 'Repeat' },
  { label: 'Daily Summary', path: '/app/summary', icon: 'Sun' },
  { label: 'Analytics', path: '/app/analytics', icon: 'BarChart3' },
  { label: 'Profile', path: '/app/profile', icon: 'User' },
  { label: 'Settings', path: '/app/settings', icon: 'Settings' },
] as const;

export const QUICK_ACTIONS = [
  { label: 'New Note', icon: 'StickyNote', shortcut: 'N' },
  { label: 'New Task', icon: 'CheckSquare', shortcut: 'T' },
  { label: 'Ask AI', icon: 'Sparkles', shortcut: 'A' },
  { label: 'Open Calendar', icon: 'Calendar', shortcut: 'C' },
] as const;

export const MOTIVATIONAL_QUOTES = [
  'Small steps every day lead to big results.',
  'Focus on progress, not perfection.',
  'The best time to start was yesterday. The next best time is now.',
  'Consistency is the bridge between goals and accomplishments.',
  'Learning is never done — only paused.',
  'A goal without a plan is just a wish.',
  'Discipline is choosing what you want most over what you want now.',
];

export const SUGGESTED_PROMPTS = [
  'Summarize my notes from today',
  'Create a study plan for this week',
  'What should I revise tomorrow?',
  'Generate flashcards from my last note',
  'Help me prioritize my tasks',
];

export const NOTE_CATEGORIES = [
  'Study',
  'Personal',
  'Work',
  'Ideas',
  'Research',
  'Meeting',
] as const;

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const TASK_STATUSES = ['todo', 'in-progress', 'review', 'done'] as const;

export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'task', 'revision', 'ai'] as const;

export const ACHIEVEMENT_BADGES = [
  { id: 'streak-7', label: '7-Day Streak', icon: 'Flame', color: 'warning' },
  { id: 'streak-30', label: '30-Day Streak', icon: 'Trophy', color: 'warning' },
  { id: 'tasks-100', label: 'Task Master', icon: 'CheckCircle2', color: 'accent' },
  { id: 'notes-50', label: 'Note Taker', icon: 'StickyNote', color: 'primary' },
  { id: 'focus-10', label: 'Deep Focus', icon: 'Target', color: 'chart-3' },
  { id: 'early-bird', label: 'Early Bird', icon: 'Sunrise', color: 'chart-1' },
] as const;
