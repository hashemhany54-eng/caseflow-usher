import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Scissors, Inbox, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

/* ------------------------------------------------------------------ */
/* Task Card                                                           */
/* ------------------------------------------------------------------ */

function TaskCard({
  task,
  selected,
  onSelect,
}: {
  task: Task;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const order = task.order;
  const dueFormatted = task.due_date
    ? `Due: ${format(new Date(task.due_date), "M/d/yyyy")}`
    : "";

  return (
    <button
      onClick={() => onSelect(task.id)}
      className={cn(
        "w-full text-left rounded-lg border bg-card p-4 transition-all",
        "hover:shadow-sm hover:border-primary/30",
        selected
          ? "border-primary/40 ring-2 ring-primary/10 shadow-sm"
          : "border-border"
      )}
    >
      {/* Row 1: Task type + Order ID */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold truncate">
          {task.task_type || "Task"}
        </span>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {order?.id}
        </span>
      </div>

      {/* Row 2: Priority + Patient name */}
      <div className="flex items-center gap-2 mb-1.5">
        <PriorityBadge priority={order?.priority || "low"} />
        <span className="text-sm text-foreground truncate">
          {order?.patient_name}
        </span>
      </div>

      {/* Row 3: Due date + tags */}
      <div className="flex items-center gap-2 flex-wrap">
        {dueFormatted && (
          <span className="text-xs text-muted-foreground">{dueFormatted}</span>
        )}
        {order?.is_split && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 gap-0.5 bg-secondary text-secondary-foreground"
          >
            <Scissors className="h-2.5 w-2.5" /> Split
          </Badge>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-14 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

interface OrderTasksPanelProps {
  currentTaskId?: string;
  className?: string;
}

export function OrderTasksPanel({ currentTaskId, className }: OrderTasksPanelProps) {
  const { tasks } = useApp();
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(currentTaskId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Simulate async load
  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const allTasks = tasks;

  const handleSelect = (id: string) => {
    setSelectedTaskId(id);
    navigate(`/tasks/${id}`);
  };

  return (
    <div
      className={cn(
        "border-r bg-card flex flex-col shrink-0 overflow-hidden w-full lg:w-80 xl:w-[340px]",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <h2 className="text-xl font-bold font-display">Your Tasks</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {allTasks.length} task{allTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {/* Loading */}
        {loading &&
          [1, 2, 3, 4].map((i) => <TaskCardSkeleton key={i} />)
        }

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <AlertCircle className="h-8 w-8 text-destructive/60 mb-3" />
            <p className="text-sm font-medium mb-1">Failed to load tasks</p>
            <p className="text-xs text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && allTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium mb-1">No tasks</p>
            <p className="text-xs text-muted-foreground">
              You have no tasks assigned yet.
            </p>
          </div>
        )}

        {/* Task cards */}
        {!loading &&
          !error &&
          allTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              selected={selectedTaskId === task.id}
              onSelect={handleSelect}
            />
          ))}
      </div>
    </div>
  );
}
