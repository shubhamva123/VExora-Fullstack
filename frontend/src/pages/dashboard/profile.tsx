import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Flame, Trophy, CheckCircle2, StickyNote,
  Target, Clock, Settings as SettingsIcon, Shield, LogOut, Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { initials, formatDate } from '@/lib/utils';
import { ACHIEVEMENT_BADGES } from '@/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame, Trophy, CheckCircle2, StickyNote, Target, Sunrise: Calendar,
};

const stats = [
  { label: 'Tasks Completed', value: '142', icon: CheckCircle2, color: 'text-primary' },
  { label: 'Notes Created', value: '67', icon: StickyNote, color: 'text-accent' },
  { label: 'Study Hours', value: '98.5', icon: Clock, color: 'text-warning' },
  { label: 'Day Streak', value: '7', icon: Flame, color: 'text-chart-3' },
];

const activity = [
  { label: 'Mon', value: 4 },
  { label: 'Tue', value: 6 },
  { label: 'Wed', value: 5 },
  { label: 'Thu', value: 8 },
  { label: 'Fri', value: 7 },
  { label: 'Sat', value: 9 },
  { label: 'Sun', value: 3 },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username ?? user?.email ?? 'User';

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account, achievements, and activity" icon={User} />

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden p-0">
          <div className="h-28 bg-gradient-to-r from-primary/20 via-accent/15 to-chart-4/15" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="h-20 w-20 border-4 border-card">
                  <AvatarFallback className="h-full w-full bg-primary/15 text-2xl font-semibold text-primary">
                    {initials(user?.username ?? user?.email ?? 'V')}
                  </AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <h2 className="text-xl font-semibold">{displayName}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />{user?.email ?? ''}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{user?.role ?? 'member'}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />Joined {user?.createdAt ? formatDate(user.createdAt) : formatDate(new Date())}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/app/settings')}>
                  <Pencil className="h-3.5 w-3.5" /> Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/app/settings')}>
                  <Shield className="h-3.5 w-3.5" /> Security
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Achievements */}
        <Card className="p-5 lg:col-span-2">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Achievements & Badges</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ACHIEVEMENT_BADGES.map((badge, i) => {
                const Icon = iconMap[badge.icon] ?? Trophy;
                const earned = i < 4;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col items-center rounded-xl border p-4 text-center ${earned ? 'border-warning/30 bg-warning/5' : 'border-border opacity-50'}`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${earned ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-2 text-sm font-medium">{badge.label}</p>
                    <Badge variant={earned ? 'default' : 'outline'} className="mt-1 text-2xs">{earned ? 'Earned' : 'Locked'}</Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity overview */}
        <Card className="p-5">
          <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
            <CardTitle className="text-base font-medium">Activity Overview</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              {activity.map((a) => (
                <div key={a.label} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-muted-foreground">{a.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(a.value / 10) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-medium">{a.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected accounts */}
      <Card className="p-5">
        <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
          <CardTitle className="text-base font-medium">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3">
            {[
              { name: 'Google', email: 'connected', connected: true },
              { name: 'Apple', email: 'not connected', connected: false },
              { name: 'GitHub', email: 'connected', connected: true },
            ].map((acc) => (
              <div key={acc.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40 text-sm font-semibold">{acc.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{acc.name}</p>
                    <p className="text-xs text-muted-foreground">{acc.email}</p>
                  </div>
                </div>
                <Button variant={acc.connected ? 'outline' : 'default'} size="sm">{acc.connected ? 'Disconnect' : 'Connect'}</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div>
          <h3 className="font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">Log out or delete your account permanently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => logout()}><LogOut className="h-4 w-4" /> Log out</Button>
          <Button variant="destructive">Delete account</Button>
        </div>
      </div>
    </div>
  );
}
