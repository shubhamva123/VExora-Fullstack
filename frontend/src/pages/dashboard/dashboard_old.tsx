import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckCircle2,
  StickyNote,
  Clock,
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  Repeat,
  Sun,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { getGreeting } from '@/lib/utils';
import { mockNotes, mockTasks, mockRevisions, mockWeeklyActivity } from '@/lib/mock-data';
import { MOTIVATIONAL_QUOTES } from '@/constants';
import { QUICK_ACTIONS } from '@/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  StickyNote,
  CheckSquare: CheckCircle2,
  Sparkles,
  Calendar: CalendarIcon,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();
  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  const todayTasks = mockTasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString());
  const upcomingTasks = mockTasks.filter((t) => t.status !== 'done').slice(0, 4);
  const recentNotes = mockNotes.slice(0, 3);
  const upcomingRevisions = mockRevisions.filter((r) => !r.completed).slice(0, 3);
  const completionRate = Math.round((mockTasks.filter((t) => t.status === 'done').length / mockTasks.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'there'}`}
        description={quote}
        icon={LayoutDashboard}
      />

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tasks completed" value={`${mockTasks.filter((t) => t.status === 'done').length}/${mockTasks.length}`} icon={CheckCircle2} trend={{ value: '+12%', positive: true }} color="primary" delay={0} />
        <StatCard label="Notes created" value={mockNotes.length} icon={StickyNote} trend={{ value: '+3', positive: true }} color="accent" delay={0.05} />
        <StatCard label="Study hours" value="24.5" icon={Clock} trend={{ value: '+2.5h', positive: true }} color="warning" delay={0.1} />
        <StatCard label="Focus score" value="87%" icon={Target} trend={{ value: '+5%', positive: true }} color="chart-3" delay={0.15} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = iconMap[action.icon] ?? Sparkles;
          return (
            <Button key={action.label} variant="outline" size="sm" className="gap-2" onClick={() => navigate('/app/notes')}>
              <Icon className="h-4 w-4" />
              {action.label}
              <kbd className="ml-1 hidden rounded border border-border bg-muted px-1 text-2xs sm:inline">{action.shortcut}</kbd>
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Summary card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold">AI Daily Summary</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  You've completed {mockTasks.filter((t) => t.status === 'done').length} tasks today — great momentum! Your focus score improved by 5%. Tomorrow's priority: review Organic Chemistry mechanisms and practice eigenvalue problems. Consider a 25-minute Pomodoro session for the past paper.
                </p>
                <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => navigate('/app/summary')}>
                  View full summary <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Activity chart */}
          <ActivityChart data={mockWeeklyActivity} />

          {/* Today's tasks */}
          <Card className="p-5">
            <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-base font-medium">Today's Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>View all</Button>
            </CardHeader>
            <CardContent className="p-0">
              {todayTasks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No tasks due today. Enjoy the breather!</p>
              ) : (
                <div className="space-y-2">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30">
                      <div className={`h-2 w-2 rounded-full ${task.priority === 'urgent' ? 'bg-destructive' : task.priority === 'high' ? 'bg-warning' : 'bg-primary'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="mt-1 flex gap-1.5">
                          {(task.labels ?? []).slice(0, 2).map((l) => (
                            <Badge key={l} variant="secondary" className="text-2xs">{l}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant={task.status === 'done' ? 'default' : 'outline'}>
                        {task.status === 'done' ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Productivity score */}
          <Card className="p-5">
            <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-base font-medium">Productivity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * completionRate) / 100 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute text-xl font-semibold">{completionRate}%</span>
                </div>
                <div className="flex-1 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Completion</span><span className="font-medium">{completionRate}%</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Streak</span><span className="flex items-center gap-1 font-medium"><Flame className="h-3.5 w-3.5 text-warning" />7 days</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Focus</span><span className="font-medium">87%</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card className="p-5">
            <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-base font-medium">Upcoming Deadlines</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-muted/30">
                      <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'urgent' ? 'bg-destructive' : task.priority === 'high' ? 'bg-warning' : 'bg-primary'}`} />
                      <span className="flex-1 truncate text-sm">{task.title}</span>
                      {task.dueDate && <span className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Revision reminders */}
          <Card className="p-5">
            <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-base font-medium">Revision Reminders</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2.5">
                {upcomingRevisions.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{r.title}</p>
                      <Badge variant="outline" className="text-2xs">{r.subject}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={r.progress} className="h-1.5" />
                      <span className="text-2xs text-muted-foreground">{r.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent notes */}
          <Card className="p-5">
            <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
              <CardTitle className="text-base font-medium">Recent Notes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {recentNotes.map((note) => (
                  <div key={note.id} className="cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-muted/30" onClick={() => navigate('/app/notes')}>
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="flex-1 truncate text-sm font-medium">{note.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
