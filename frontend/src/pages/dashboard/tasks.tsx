import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import tasksService, { Task } from "@/services/tasks.service";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<"list" | "board">("board");
  const [search, setSearch] = useState("");

  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [date, setDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    void loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await tasksService.list();
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return tasks.filter((task) =>
      (task.title ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  async function createTask() {
    if (!title.trim()) {
      toast.error("Task title required");
      return;
    }

    if (!date) {
      toast.error("Select date");
      return;
    }

    try {
      const task = await tasksService.create({
        task_title: title,
        description,
        priority,
        scheduled_date: date,
      });

      setTasks((prev) => [...prev, task]);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDate("");

      toast.success("Task created");
    } catch (err) {
      console.error(err);
      toast.error("Unable to create task");
    }
  }

  function openEdit(task: Task) {
    setEditingTask(task);

    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority as "low" | "medium" | "high");
    setDate(task.dueDate ?? "");

    setEditOpen(true);
  }

  async function saveEditTask() {
    if (!editingTask) return;

    try {
      const updated = await tasksService.update(Number(editingTask.id), {
        task_title: title,
        description,
        priority,
        scheduled_date: date,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      );

      toast.success("Task updated");

      setEditOpen(false);
      setEditingTask(null);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDate("");
    } catch {
      toast.error("Unable to update task");
    }
  }

  // Toggle subtask checked state, update progress and optionally mark complete
  async function toggleSubtask(task: Task, subtaskId: string) {
    try {
      // compute updated local subtasks
      const updatedTasks = tasks.map((t) => {
        if (String(t.id) !== String(task.id)) return t;
        const subtasks = (t.subtasks ?? []).map((s: any) =>
          String(s.id) === String(subtaskId) ? { ...s, done: !s.done } : s
        );

        const total = subtasks.length || 1;
        const doneCount = subtasks.filter((s: any) => s.done).length;
        const newProgress = Math.round((doneCount / total) * 100);

        // determine new status if progress reaches 100%
        const isCompleted = newProgress === 100;
        const newStatus = isCompleted ? "completed" : t.status;

        return { ...t, subtasks, progress: newProgress, status: newStatus };
      });

      setTasks(updatedTasks);

      // Persist the update for this task to server (send progress and status)
      const current = updatedTasks.find((t) => String(t.id) === String(task.id));
      if (current) {
        await tasksService.update(Number(current.id), {
          progress: current.progress,
          status: current.status as any,
        });
      }

      if (current?.progress === 100) {
        toast.success("Task completed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to update checklist");
      // reload tasks to revert optimistic change
      void loadTasks();
    }
  }

  async function updateStatus(task: Task, status: Task["status"]) {
    try {
      const updated = await tasksService.update(Number(task.id), {
        status,
      });

      setTasks((prev) =>
        prev.map((t) =>
          String(t.id) === String(task.id) ? updated : t
        )
      );

      toast.success("Task updated");
    } catch {
      toast.error("Unable to update");
    }
  }

  async function deleteTask(taskId: number) {
    try {
      await tasksService.delete(taskId);

      setTasks((prev) =>
        prev.filter((t) => String(t.id) !== String(taskId))
      );

      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage your daily work"
        icon={CheckCircle2}
        actions={
          <Button onClick={() => setCreating(!creating)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        }
      />

      {creating && (
        <Card className="space-y-4 p-5">
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full rounded-md border p-2"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button onClick={createTask}>Create Task</Button>
        </Card>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          variant={view === "board" ? "default" : "outline"}
          onClick={() => setView("board")}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Board
        </Button>

        <Button
          variant={view === "list" ? "default" : "outline"}
          onClick={() => setView("list")}
        >
          <List className="mr-2 h-4 w-4" />
          List
        </Button>
      </div>

      {view === "board" ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((task) => (
            <motion.div
              key={String(task.id)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <h3 className={"text-lg font-semibold " + ((task.progress === 100 || task.status === 'completed' || task.status === 'done') ? 'line-through text-muted-foreground' : '')}>{task.title}</h3>

                    {task.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No Due Date"}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      task.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>

                <div className="mt-2">
                  <Badge
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{task.progress ?? 0}%</span>
                  </div>

                  <div className="h-2 rounded bg-muted">
                    <div
                      className="h-full rounded bg-primary"
                      style={{
                        width: `${task.progress ?? 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Subtasks / Checklist */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {task.subtasks.map((s: any) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={!!s.done}
                          onCheckedChange={() => toggleSubtask(task, s.id)}
                        />
                        <span className={"text-sm " + (s.done ? 'line-through text-muted-foreground' : '')}>{s.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() =>
                      updateStatus(
                        task,
                        task.status === "completed" ? "pending" : "completed"
                      )
                    }
                  >
                    {task.status === "completed"
                      ? "Mark Pending"
                      : "Mark Complete"}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEdit(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTask(Number(task.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <Card className="col-span-full p-10 text-center text-muted-foreground">
              No tasks found.
            </Card>
          )}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((task) => (
                <tr key={String(task.id)} className="border-b">
                  <td className="p-4">{task.title}</td>
                  <td className="p-4">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No Due Date"}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        task.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus(
                            task,
                            task.status === "completed" ? "pending" : "completed"
                          )
                        }
                      >
                        Toggle
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(task)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTask(Number(task.id))}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="w-full rounded-md border p-2"
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as "low" | "medium" | "high"
                )
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>

            <Button onClick={saveEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}