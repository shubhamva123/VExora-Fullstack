import type { Note, Task, CalendarEvent, RevisionItem, Conversation, AppNotification, AnalyticsDataPoint, ActivitySeries } from '@/types';

const now = new Date();
const iso = (daysAgo: number, hoursAgo = 0) =>
  new Date(now.getTime() - daysAgo * 86400000 - hoursAgo * 3600000).toISOString();
const future = (daysAhead: number) =>
  new Date(now.getTime() + daysAhead * 86400000).toISOString();

export const mockNotes: Note[] = [
  {
    id: 'n1',
    title: 'Organic Chemistry — Reaction Mechanisms',
    content: 'SN1 vs SN2 reactions. SN1 is a two-step mechanism with a carbocation intermediate. SN2 is a single concerted step with backside attack.',
    category: 'Study',
    tags: ['chemistry', 'organic', 'mechanisms'],
    isFavorite: true,
    isPinned: true,
    createdAt: iso(2),
    updatedAt: iso(0, 2),
    revisionDue: future(1),
  },
  {
    id: 'n2',
    title: 'Linear Algebra — Eigenvalues',
    content: 'Eigenvalues are scalars λ such that Av = λv for some nonzero vector v. The characteristic polynomial det(A - λI) = 0 gives eigenvalues.',
    category: 'Study',
    tags: ['math', 'linear-algebra'],
    isFavorite: false,
    isPinned: true,
    createdAt: iso(5),
    updatedAt: iso(1),
    revisionDue: future(3),
  },
  {
    id: 'n3',
    title: 'Project Ideas — Study App',
    content: 'A spaced repetition app with AI-generated flashcards and progress analytics. Could integrate with note-taking.',
    category: 'Ideas',
    tags: ['project', 'app', 'ai'],
    isFavorite: true,
    isPinned: false,
    createdAt: iso(10),
    updatedAt: iso(4),
  },
  {
    id: 'n4',
    title: 'Meeting Notes — Study Group',
    content: 'Discussed splitting chapters for the upcoming exam. I take chapters 4-6, Alex takes 7-9. Next meeting Thursday.',
    category: 'Meeting',
    tags: ['group', 'exam'],
    isFavorite: false,
    isPinned: false,
    createdAt: iso(3),
    updatedAt: iso(3),
  },
  {
    id: 'n5',
    title: 'Research — Spaced Repetition Algorithms',
    content: 'SM-2 algorithm by SuperMemo. Interval = previous * EF. EF starts at 2.5 and adjusts based on recall quality.',
    category: 'Research',
    tags: ['spaced-repetition', 'algorithm'],
    isFavorite: false,
    isPinned: false,
    createdAt: iso(7),
    updatedAt: iso(2),
    revisionDue: future(5),
  },
  {
    id: 'n6',
    title: 'Personal — Weekly Reflection',
    content: 'This week I stayed consistent with morning study sessions. Need to improve sleep schedule for better focus.',
    category: 'Personal',
    tags: ['reflection', 'habits'],
    isFavorite: true,
    isPinned: false,
    createdAt: iso(1),
    updatedAt: iso(0, 5),
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Submit lab report',
    description: 'Complete the titration lab report and submit via the portal.',
    status: 'done',
    priority: 'high',
    dueDate: iso(0),
    labels: ['chemistry', 'urgent'],
    progress: 100,
    subtasks: [
      { id: 's1', title: 'Write introduction', done: true },
      { id: 's2', title: 'Plot graph', done: true },
      { id: 's3', title: 'Submit', done: true },
    ],
    createdAt: iso(3),
    updatedAt: iso(0),
  },
  {
    id: 't2',
    title: 'Review eigenvalue problems',
    status: 'in-progress',
    priority: 'medium',
    dueDate: future(1),
    labels: ['math', 'revision'],
    progress: 60,
    subtasks: [
      { id: 's4', title: 'Practice set 1', done: true },
      { id: 's5', title: 'Practice set 2', done: false },
    ],
    createdAt: iso(2),
    updatedAt: iso(0, 3),
  },
  {
    id: 't3',
    title: 'Prepare presentation slides',
    status: 'todo',
    priority: 'high',
    dueDate: future(2),
    labels: ['presentation'],
    progress: 0,
    subtasks: [],
    createdAt: iso(1),
    updatedAt: iso(1),
  },
  {
    id: 't4',
    title: 'Read chapter 7 — Thermodynamics',
    status: 'todo',
    priority: 'medium',
    dueDate: future(4),
    labels: ['physics', 'reading'],
    progress: 0,
    subtasks: [],
    createdAt: iso(0, 6),
    updatedAt: iso(0, 6),
  },
  {
    id: 't5',
    title: 'Organize study group notes',
    status: 'review',
    priority: 'low',
    dueDate: future(3),
    labels: ['group'],
    progress: 80,
    subtasks: [{ id: 's6', title: 'Merge notes from all members', done: false }],
    createdAt: iso(2),
    updatedAt: iso(0, 1),
  },
  {
    id: 't6',
    title: 'Practice past paper — 2023',
    status: 'todo',
    priority: 'urgent',
    dueDate: future(0),
    labels: ['exam'],
    progress: 0,
    subtasks: [],
    createdAt: iso(0, 2),
    updatedAt: iso(0, 2),
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Study group meeting', type: 'study', date: future(0), startTime: '14:00', endTime: '15:30' },
  { id: 'e2', title: 'Chemistry revision', type: 'revision', date: future(1), startTime: '09:00', endTime: '10:00' },
  { id: 'e3', title: 'Submit lab report', type: 'task', date: iso(0), allDay: undefined } as CalendarEvent,
  { id: 'e4', title: 'Math practice session', type: 'study', date: future(2), startTime: '16:00', endTime: '18:00' },
  { id: 'e5', title: 'Presentation due', type: 'task', date: future(2) },
  { id: 'e6', title: 'Past paper practice', type: 'reminder', date: future(0), startTime: '19:00' },
  { id: 'e7', title: 'Thermodynamics reading', type: 'study', date: future(4), startTime: '10:00', endTime: '12:00' },
];

export const mockRevisions: RevisionItem[] = [
  { id: 'r1', title: 'Organic Chemistry Ch.4', subject: 'Chemistry', scheduledDate: future(1), completed: false, interval: 3, lastReviewed: iso(2), nextReview: future(1), progress: 65 },
  { id: 'r2', title: 'Eigenvalues & Eigenvectors', subject: 'Mathematics', scheduledDate: future(3), completed: false, interval: 5, lastReviewed: iso(2), nextReview: future(3), progress: 40 },
  { id: 'r3', title: 'Thermodynamics Basics', subject: 'Physics', scheduledDate: future(5), completed: false, interval: 7, lastReviewed: iso(0), nextReview: future(6), progress: 20 },
  { id: 'r4', title: 'Cell Biology — Mitosis', subject: 'Biology', scheduledDate: iso(1), completed: true, interval: 2, lastReviewed: iso(1), nextReview: future(1), progress: 100 },
  { id: 'r5', title: 'Calculus — Integration by Parts', subject: 'Mathematics', scheduledDate: iso(3), completed: true, interval: 4, lastReviewed: iso(3), nextReview: future(1), progress: 100 },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Study plan for finals',
    pinned: true,
    createdAt: iso(3),
    updatedAt: iso(0, 1),
    messages: [
      { id: 'm1', role: 'user', content: 'Help me create a 2-week study plan for my finals.', createdAt: iso(3) },
      { id: 'm2', role: 'assistant', content: "Here's a focused 2-week plan:\n\n**Week 1**\n- Morning: Chemistry (2h)\n- Afternoon: Math (2h)\n- Evening: Practice problems\n\n**Week 2**\n- Past papers + weak areas\n- Group study sessions\n- Light review + rest\n\nWould you like me to break this down by day?", createdAt: iso(3) },
    ],
  },
  {
    id: 'c2',
    title: 'Explain SN1 vs SN2',
    pinned: false,
    createdAt: iso(5),
    updatedAt: iso(4),
    messages: [
      { id: 'm3', role: 'user', content: 'Can you explain the difference between SN1 and SN2 reactions?', createdAt: iso(5) },
      { id: 'm4', role: 'assistant', content: '**SN1** (unimolecular): two-step, carbocation intermediate, rate depends only on substrate. Favored by tertiary carbons and polar protic solvents.\n\n**SN2** (bimolecular): one concerted step, backside attack, rate depends on both substrate and nucleophile. Favored by primary carbons and polar aprotic solvents.', createdAt: iso(5) },
    ],
  },
  {
    id: 'c3',
    title: 'Flashcard generation',
    pinned: false,
    createdAt: iso(8),
    updatedAt: iso(7),
    messages: [
      { id: 'm5', role: 'user', content: 'Generate 5 flashcards from my thermodynamics notes.', createdAt: iso(8) },
      { id: 'm6', role: 'assistant', content: '1. **Q:** First law of thermodynamics? **A:** Energy cannot be created or destroyed, only transformed.\n2. **Q:** What is enthalpy? **A:** H = U + PV\n3. **Q:** SI unit of entropy? **A:** J/K\n4. **Q:** What does a Carnot engine do? **A:** Achieves maximum possible efficiency between two temperatures.\n5. **Q:** Define heat capacity. **A:** The amount of heat required to raise the temperature by 1K.', createdAt: iso(8) },
    ],
  },
];

export const mockWeeklyActivity: AnalyticsDataPoint[] = [
  { label: 'Mon', value: 4 },
  { label: 'Tue', value: 6 },
  { label: 'Wed', value: 5 },
  { label: 'Thu', value: 8 },
  { label: 'Fri', value: 7 },
  { label: 'Sat', value: 9 },
  { label: 'Sun', value: 3 },
];

export const mockMonthlyActivity: AnalyticsDataPoint[] = [
  { label: 'W1', value: 22 },
  { label: 'W2', value: 28 },
  { label: 'W3', value: 31 },
  { label: 'W4', value: 26 },
];

export const mockActivitySeries: ActivitySeries[] = [
  {
    name: 'Tasks',
    color: 'hsl(var(--chart-1))',
    data: [
      { label: 'Mon', value: 3 },
      { label: 'Tue', value: 4 },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 5 },
      { label: 'Fri', value: 4 },
      { label: 'Sat', value: 6 },
      { label: 'Sun', value: 2 },
    ],
  },
  {
    name: 'Notes',
    color: 'hsl(var(--chart-2))',
    data: [
      { label: 'Mon', value: 1 },
      { label: 'Tue', value: 2 },
      { label: 'Wed', value: 3 },
      { label: 'Thu', value: 3 },
      { label: 'Fri', value: 2 },
      { label: 'Sat', value: 3 },
      { label: 'Sun', value: 1 },
    ],
  },
  {
    name: 'Study hours',
    color: 'hsl(var(--chart-3))',
    data: [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 3 },
      { label: 'Wed', value: 2 },
      { label: 'Thu', value: 4 },
      { label: 'Fri', value: 3 },
      { label: 'Sat', value: 5 },
      { label: 'Sun', value: 1 },
    ],
  },
];

export const mockCompletionTrend: AnalyticsDataPoint[] = [
  { label: 'Jan', value: 72 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 81 },
  { label: 'Apr', value: 76 },
  { label: 'May', value: 85 },
  { label: 'Jun', value: 88 },
  { label: 'Jul', value: 91 },
];
