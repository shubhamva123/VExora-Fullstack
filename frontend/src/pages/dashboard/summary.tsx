import { motion } from 'framer-motion';
import {
  Sun, CheckCircle2, StickyNote, Repeat, Target, Flame,
  TrendingUp, Sparkles, ArrowRight, BookOpen, Lightbulb,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { getGreeting } from '@/lib/utils';
import { mockNotes, mockTasks, mockRevisions } from '@/lib/mock-data';
import { MOTIVATIONAL_QUOTES } from '@/constants';

export default function SummaryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  const todayTasks = mockTasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString());
  const completedToday = mockTasks.filter((t) => t.status === 'done');
  const todayNotes = mockNotes.slice(0, 3);
  const upcomingRevisions = mockRevisions.filter((r) => !r.completed).slice(0, 3);
  const completionRate = Math.round((completedToday.length / mockTasks.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader title="Daily Summary" description={quote} icon={Sun} />

      {/* AI Summary banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Sparkles className="h-5 w-5" /></div>
              <h3 className="font-semibold">Your AI-Generated Summary</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'}. Today you completed {completedToday.length} tasks and created {todayNotes.length} notes. Your productivity is trending upward with a {completionRate}% completion rate. You're on a 7-day streak — keep it going! Tomorrow's focus should be on Organic Chemistry revision and eigenvalue practice. Consider scheduling a deep-focus session for the past paper.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Score cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard icon={Target} label="Productivity Score" value="87%" color="primary" delay={0} />
        <ScoreCard icon={Flame} label="Focus Score" value="92%" color="accent" delay={0.05} />
        <ScoreCard icon={CheckCircle2} label="Completion" value={`${completionRate}%`} color="warning" delay={0.1} />
        <ScoreCard icon={TrendingUp} label="Streak" value="7 days" color="chart-3" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's tasks */}
        <Card className="p-5 lg:col-span-2">
          <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Today's Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/tasks')}>View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No tasks due today</p>
              ) : todayTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  <CheckCircle2 className={`h-4 w-4 ${t.status === 'done' ? 'text-success' : 'text-muted-foreground'}`} />
                  <span className={`flex-1 text-sm ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</span>
                  <Badge variant="outline" className="text-2xs capitalize">{t.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational quote */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning"><Lightbulb className="h-6 w-6" /></div>
          <p className="text-sm italic text-muted-foreground">"{quote}"</p>
        </Card>

        {/* Today's notes */}
        <Card className="p-5 lg:col-span-2">
          <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Today's Notes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/notes')}>View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {todayNotes.map((n) => (
                <div key={n.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{n.content}</p>
                  </div>
                </div>
              ))}
            </div>
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
                  <p className="text-sm font-medium">{r.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={r.progress} className="h-1.5" />
                    <span className="text-2xs text-muted-foreground">{r.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming priorities */}
        <Card className="p-5 lg:col-span-2">
          <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Upcoming Priorities</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {mockTasks.filter((t) => t.status !== 'done').slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/30">
                  <div className={`h-1.5 w-1.5 rounded-full ${t.priority === 'urgent' ? 'bg-destructive' : t.priority === 'high' ? 'bg-warning' : 'bg-primary'}`} />
                  <span className="flex-1 text-sm">{t.title}</span>
                  {t.dueDate && <span className="text-xs text-muted-foreground">{new Date(t.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study recommendations */}
        <Card className="p-5">
          <CardHeader className="mb-3 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">AI Study Recommendations</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Review SN1 vs SN2 mechanisms — your weakest area this week</div>
              <div className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Practice 5 eigenvalue problems to reinforce concepts</div>
              <div className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Schedule a 25-min Pomodoro for past paper practice</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, color, delay }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string; delay: number }) {
  const colorMap: Record<string, string> = { primary: 'bg-primary/10 text-primary', accent: 'bg-accent/10 text-accent', warning: 'bg-warning/10 text-warning', 'chart-3': 'bg-chart-3/10 text-chart-3' };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color]}`}><Icon className="h-5 w-5" /></div>
        <p className="mt-4 text-2xl font-semibold">{value}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </Card>
    </motion.div>
  );
}
