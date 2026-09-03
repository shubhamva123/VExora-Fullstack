import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, CheckCircle2, StickyNote, Clock, Flame,
  Target, Sparkles, BookOpen, Brain,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/stat-card';
import { mockWeeklyActivity, mockMonthlyActivity, mockActivitySeries, mockCompletionTrend } from '@/lib/mock-data';

const focusData = [
  { label: 'Mon', sessions: 3, minutes: 75 },
  { label: 'Tue', sessions: 4, minutes: 100 },
  { label: 'Wed', sessions: 2, minutes: 50 },
  { label: 'Thu', sessions: 5, minutes: 125 },
  { label: 'Fri', sessions: 3, minutes: 90 },
  { label: 'Sat', sessions: 6, minutes: 150 },
  { label: 'Sun', sessions: 1, minutes: 25 },
];

const pieData = [
  { name: 'Study', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Revision', value: 25, color: 'hsl(var(--chart-3))' },
  { name: 'Tasks', value: 20, color: 'hsl(var(--accent))' },
  { name: 'Notes', value: 10, color: 'hsl(var(--chart-4))' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track your productivity and learning progress over time" icon={BarChart3} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completed Tasks" value="142" icon={CheckCircle2} trend={{ value: '+18%', positive: true }} color="primary" />
        <StatCard label="Notes Created" value="67" icon={StickyNote} trend={{ value: '+12%', positive: true }} color="accent" />
        <StatCard label="Study Hours" value="98.5" icon={Clock} trend={{ value: '+8h', positive: true }} color="warning" />
        <StatCard label="Current Streak" value="7 days" icon={Flame} trend={{ value: 'Best: 21', positive: true }} color="chart-3" />
      </div>

      {/* Weekly + Monthly charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Weekly Productivity</CardTitle>
            <Badge variant="secondary">This week</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockWeeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Monthly Productivity</CardTitle>
            <Badge variant="secondary">This month</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockMonthlyActivity}>
                <defs>
                  <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#monthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity series */}
      <Card className="p-5">
        <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
          <CardTitle className="text-base font-medium">Activity Breakdown</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockActivitySeries[0].data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
              <Legend />
              {mockActivitySeries.map((s) => (
                <Line key={s.name} type="monotone" dataKey="value" name={s.name} data={s.data} stroke={s.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Focus sessions + completion trend + distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Focus Sessions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={focusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <Bar dataKey="sessions" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Completion Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Time Distribution</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
                <Legend fontSize={11} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary"><Brain className="h-4 w-4" /></div>
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-lg border border-border/50 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">Your most productive day is <span className="font-medium text-foreground">Saturday</span> with 9 completed activities. Consider scheduling deep work sessions on weekends.</p>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-border/50 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">Your completion rate has improved by <span className="font-medium text-foreground">19%</span> over the last 6 months. Keep up the consistency!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
