import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  CheckCircle2,
  Clock,
  TrendingUp,
  History,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/common/page-header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

import {
  revisionService,
  type Revision,
} from '@/services/revision.service';

type RevisionTab = 'upcoming' | 'completed' | 'all';

type NormalizedRevision = Revision & {
  completed: boolean;
  progress: number;
};

export default function RevisionPage() {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [tab, setTab] = useState<RevisionTab>('upcoming');
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    loadRevisions();
  }, []);

  async function loadRevisions() {
    try {
      setLoading(true);

      const data = await revisionService.getRevisions();

      setRevisions(data);
    } catch (error) {
      console.error('Failed to load revisions:', error);
      toast.error('Unable to load revisions');
    } finally {
      setLoading(false);
    }
  }

  const normalizedRevisions = useMemo<NormalizedRevision[]>(() => {
    return revisions.map((revision) => {
      const completed =
        revision.status === 'completed' ||
        revision.completed_date !== null;

      return {
        ...revision,
        completed,
        progress: completed ? 100 : 0,
      };
    });
  }, [revisions]);

  const upcoming = useMemo(() => {
    return normalizedRevisions
      .filter((revision) => !revision.completed)
      .sort((a, b) => {
        const dateA = a.scheduled_date
          ? new Date(a.scheduled_date).getTime()
          : 0;

        const dateB = b.scheduled_date
          ? new Date(b.scheduled_date).getTime()
          : 0;

        return dateA - dateB;
      });
  }, [normalizedRevisions]);

  const completed = useMemo(() => {
    return normalizedRevisions.filter(
      (revision) => revision.completed,
    );
  }, [normalizedRevisions]);

  const display =
    tab === 'upcoming'
      ? upcoming
      : tab === 'completed'
        ? completed
        : normalizedRevisions;

  const overallProgress =
    normalizedRevisions.length === 0
      ? 0
      : Math.round(
          (completed.length / normalizedRevisions.length) * 100,
        );

  async function markComplete(revisionId: number) {
    try {
      setCompletingId(revisionId);

      const updated =
        await revisionService.completeRevision(revisionId);

      setRevisions((prev) =>
        prev.map((revision) =>
          revision.revision_id === updated.revision_id
            ? updated
            : revision,
        ),
      );

      toast.success('Revision marked complete');
    } catch (error) {
      console.error(
        'Failed to complete revision:',
        error,
      );

      toast.error('Failed to mark revision complete');
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revision Planner"
        description="Spaced repetition schedules to reinforce your learning"
        icon={Repeat}
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {upcoming.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Upcoming
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {completed.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-semibold">
                {overallProgress}%
              </p>

              <p className="text-sm text-muted-foreground">
                Overall Progress
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* TABS */}

      <Tabs
        value={tab}
        onValueChange={(value) =>
          setTab(value as RevisionTab)
        }
      >
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming
          </TabsTrigger>

          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>

          <TabsTrigger value="all">
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* TIMELINE */}

      <Card className="p-5">
        <CardHeader className="mb-4 flex flex-row items-center justify-between space-y-0 p-0">
          <CardTitle className="text-base font-medium">
            Revision Timeline
          </CardTitle>

          <History className="h-4 w-4 text-muted-foreground" />
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : display.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No revisions in this view
            </p>
          ) : (
            <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
              {display.map((revision, index) => (
                <RevisionTimelineItem
                  key={revision.revision_id}
                  item={revision}
                  delay={index * 0.05}
                  loading={
                    completingId === revision.revision_id
                  }
                  onComplete={() =>
                    markComplete(revision.revision_id)
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RevisionTimelineItem({
  item,
  delay,
  loading,
  onComplete,
}: {
  item: NormalizedRevision;
  delay: number;
  loading: boolean;
  onComplete: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -8,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay,
      }}
      className="relative flex gap-4 pl-2"
    >
      {/* ICON */}

      <div
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
          item.completed
            ? 'border-success bg-success/10 text-success'
            : 'border-primary bg-card text-primary',
        )}
      >
        {item.completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Repeat className="h-4 w-4" />
        )}
      </div>

      {/* CARD */}

      <div
        className={cn(
          'flex-1 rounded-lg border border-border/50 p-3.5 transition-all',
          item.completed &&
            'bg-muted/40 opacity-80',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                'text-sm font-medium transition-all',
                item.completed &&
                  'text-muted-foreground line-through',
              )}
            >
              Revision #{item.revision_number}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="text-2xs"
              >
                Note #{item.note_id}
              </Badge>

              <span className="text-2xs text-muted-foreground">
                Due {formatDate(item.scheduled_date)}
              </span>

              <span className="text-2xs text-muted-foreground">
                Interval: {item.interval_days}d
              </span>

              <span className="text-2xs text-muted-foreground">
                Status: {item.status}
              </span>
            </div>
          </div>

          {!item.completed && (
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={onComplete}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Mark done'
              )}
            </Button>
          )}
        </div>

        {/* PROGRESS */}

        <div className="mt-2.5 flex items-center gap-2">
          <Progress
            value={item.progress}
            className="h-1.5"
          />

          <span className="text-2xs text-muted-foreground">
            {item.progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}