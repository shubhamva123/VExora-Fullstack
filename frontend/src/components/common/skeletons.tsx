import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border bg-card/40', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-muted/30 to-transparent" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 rounded bg-muted/50" />
        <div className="h-3 w-full rounded bg-muted/40" />
        <div className="h-3 w-4/5 rounded bg-muted/40" />
      </div>
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg p-3', className)}>
      <div className="h-4 w-4 rounded bg-muted/50" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-muted/50" />
        <div className="h-2.5 w-1/2 rounded bg-muted/40" />
      </div>
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-64 items-end justify-around gap-2 rounded-xl border border-border bg-card/40 p-4', className)}>
      {[40, 65, 50, 80, 60, 90, 45].map((h, i) => (
        <div key={i} className="w-full rounded-t bg-muted/40" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
