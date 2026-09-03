import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import calendarService from "@/services/calendar.service";

type CalendarEvent = Awaited<ReturnType<typeof calendarService.list>>[number];

const eventColors: Record<string, string> = {
  task: "bg-primary",
  revision: "bg-warning",
  reminder: "bg-accent",
  study: "bg-chart-1",
  personal: "bg-chart-4",
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateOnly(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // allow user to disable the calendar UI locally if backend/calendar is not available
  const [calendarDisabled, setCalendarDisabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("vexora.calendarDisabled") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!calendarDisabled) {
      void loadEvents();
    } else {
      setLoading(false);
    }
  }, [calendarDisabled]);

  async function loadEvents() {
    try {
      const data = await calendarService.list();
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load calendar events");
      // keep calendar visible but empty; provide user an option to disable the calendar if backend is unavailable
    } finally {
      setLoading(false);
    }
  }

  function toggleCalendarDisabled(value?: boolean) {
    const next = typeof value === 'boolean' ? value : !calendarDisabled;
    setCalendarDisabled(next);
    try {
      localStorage.setItem("vexora.calendarDisabled", next ? "true" : "false");
    } catch {}
  }

  const eventsForDay = (date: Date) =>
    events.filter((event) => {
      const eventDate = new Date(event.start_datetime ?? event.date ?? new Date().toISOString());
      return eventDate.toDateString() === date.toDateString();
    });

  const navigateDate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    else if (view === "week") d.setDate(d.getDate() + dir * 7);
    else if (view === "day") d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading calendar...
      </div>
    );
  }

  // if user has disabled the calendar (because backend was flaky), show a friendly message
  if (calendarDisabled) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Calendar (Disabled)"
          description="Calendar has been disabled. You can re-enable to retry loading events."
          icon={CalendarIcon}
          actions={
            <div className="flex items-center gap-2">
              <Button onClick={() => toggleCalendarDisabled(false)}>
                Enable Calendar
              </Button>
              <Button variant="outline" onClick={() => toggleCalendarDisabled(true)}>
                Keep Disabled
              </Button>
            </div>
          }
        />

        <Card className="p-6 text-center text-muted-foreground">
          Calendar is currently disabled. If the calendar was not loading due to a server issue, enabling it will retry fetching events. You can also keep it disabled to hide the calendar UI.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Plan your schedule with tasks, revisions, and reminders"
        icon={CalendarIcon}
        actions={
          <Button
            className="gap-2"
            onClick={() => toast.info("Event creation will open here")}
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <span className="ml-2 text-lg font-semibold">
            {view === "day"
              ? currentDate.toLocaleDateString("en", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : currentDate.toLocaleDateString("en", {
                  month: "long",
                  year: "numeric",
                })}
          </span>
        </div>

        <Tabs
          value={view}
          onValueChange={(v) =>
            setView(v as "month" | "week" | "day" | "agenda")
          }
        >
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          eventsForDay={eventsForDay}
        />
      )}

      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          eventsForDay={eventsForDay}
        />
      )}

      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={eventsForDay(currentDate)}
        />
      )}

      {view === "agenda" && <AgendaView events={events} />}
    </div>
  );
}

function MonthView({
  currentDate,
  eventsForDay,
}: {
  currentDate: Date;
  eventsForDay: (d: Date) => CalendarEvent[];
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          const isToday = date?.toDateString() === new Date().toDateString();
          const dayEvents = date ? eventsForDay(date) : [];

          return (
            <div
              key={`${date?.toISOString() ?? "empty"}-${i}`}
              className={cn(
                "min-h-24 border-b border-r border-border/50 p-1.5",
                !date && "bg-muted/20"
              )}
            >
              {date && (
                <>
                  <div
                    className={cn(
                      "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {date.getDate()}
                  </div>

                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      const eventType = event.event_type ?? event.type ?? "study";
                      return (
                        <div
                          key={event.event_id ?? event.id ?? event.title}
                          className="flex items-center gap-1 rounded px-1 py-0.5 text-2xs hover:bg-muted/40"
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              eventColors[eventType] ?? "bg-primary"
                            )}
                          />
                          <span className="truncate">{event.title}</span>
                        </div>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <span className="px-1 text-2xs text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeekView({
  currentDate,
  eventsForDay,
}: {
  currentDate: Date;
  eventsForDay: (d: Date) => CalendarEvent[];
}) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid gap-3 lg:grid-cols-7">
      {days.map((date) => {
        const isToday = date.toDateString() === new Date().toDateString();
        const dayEvents = eventsForDay(date);

        return (
          <Card
            key={date.toISOString()}
            className={cn("min-h-48 p-3", isToday && "border-primary/40")}
          >
            <div
              className={cn(
                "mb-2 text-center text-xs font-medium",
                isToday ? "text-primary" : "text-muted-foreground"
              )}
            >
              {weekDays[date.getDay()]} {date.getDate()}
            </div>

            <div className="space-y-1.5">
              {dayEvents.map((event) => {
                const eventType = event.event_type ?? event.type ?? "study";
                const eventStart = event.start_datetime ?? event.date ?? "";
                return (
                  <motion.div
                    key={event.event_id ?? event.id ?? event.title}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-border/50 p-1.5"
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          eventColors[eventType] ?? "bg-primary"
                        )}
                      />
                      <span className="truncate text-2xs font-medium">
                        {event.title}
                      </span>
                    </div>

                    {eventStart && (
                      <span className="mt-0.5 block text-2xs text-muted-foreground">
                        {formatTime(eventStart)}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function DayView({
  currentDate,
  events,
}: {
  currentDate: Date;
  events: CalendarEvent[];
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <div className="space-y-1">
          {hours.map((hour) => {
            const hourEvents = events.filter((event) => {
             const eventDate = new Date(event.start_datetime ?? event.date ?? new Date().toISOString());
              return eventDate.getHours() === hour;
            });

            return (
              <div
                key={hour}
                className="flex gap-3 border-t border-border/30 pt-1"
              >
                <span className="w-12 shrink-0 text-xs text-muted-foreground">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </span>

                <div className="flex-1 space-y-1">
                  {hourEvents.map((event) => {
                    const eventType = event.event_type ?? event.type ?? "study";
                    const start = event.start_datetime ?? event.date ?? "";
                    const end = event.end_datetime ?? "";
                    return (
                      <div
                        key={event.event_id ?? event.id ?? event.title}
                        className="flex items-center gap-2 rounded-lg bg-primary/10 px-2 py-1.5"
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            eventColors[eventType] ?? "bg-primary"
                          )}
                        />
                        <span className="text-sm font-medium">{event.title}</span>

                        {start && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(start)}
                            {end ? ` - ${formatTime(end)}` : ""}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}

function AgendaView({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort((a, b) => {
    const aTime = new Date(a.start_datetime ?? a.date ?? new Date().toISOString()).getTime();
    const bTime = new Date(b.start_datetime ?? b.date ?? new Date().toISOString()).getTime();
    return aTime - bTime;
  });

  return (
    <Card className="p-4">
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {sorted.map((event) => {
           const eventType = event.event_type ?? event.type ?? "study";
           const start = new Date(event.start_datetime ?? event.date ?? new Date().toISOString());
           const day = start.getDate();
           const shortMonth = start.toLocaleDateString("en", {
             month: "short",
           });

           return (
             <motion.div
               key={event.event_id ?? event.id ?? event.title}
               initial={{ opacity: 0, x: -8 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30"
             >
               <div className="flex w-14 shrink-0 flex-col items-center">
                 <span className="text-lg font-semibold">{day}</span>
                 <span className="text-xs text-muted-foreground">
                   {shortMonth}
                 </span>
               </div>

               <span
                 className={cn(
                   "h-8 w-1 rounded-full",
                   eventColors[eventType] ?? "bg-primary"
                 )}
               />

               <div className="flex-1">
                 <p className="text-sm font-medium">{event.title}</p>

                 {event.start_datetime ?? event.date ? (
                   <p className="flex items-center gap-1 text-xs text-muted-foreground">
                     <Clock className="h-3 w-3" />
                     {formatTime(event.start_datetime ?? event.date)}
                     {event.end_datetime
                       ? ` - ${formatTime(event.end_datetime)}`
                       : ""}
                   </p>
                 ) : null}
               </div>

               <Badge variant="outline" className="capitalize">
                 {eventType}
               </Badge>
             </motion.div>
           );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}