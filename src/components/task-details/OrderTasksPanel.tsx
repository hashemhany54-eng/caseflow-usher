import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Scissors, Inbox, AlertCircle, CircleDot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Due indicator                                                       */
/* ------------------------------------------------------------------ */

function TaskDueIndicator({ dueDate }: { dueDate: string }) {
  const { timeLeft, isOverdue, isUrgent } = useCountdown(dueDate);
  return (
    <span
      className={cn(
        "text-xs font-medium whitespace-nowrap",
        isOverdue && "text-destructive",
        isUrgent && "text-warning",
        !isOverdue && !isUrgent && "text-muted-foreground"
      )}
    >
      {timeLeft}
    </span>
  );
}

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
  const tags: string[] = [];
  if (order?.is_split) tags.push("Split");
  if (order?.qc_required) tags.push("QC");
  if (order?.status === "on_hold") tags.push("Hold");

  return (
    <button
      onClick={() => onSelect(task.id)}
      className={cn(
        "w-full text-left rounded-lg border bg-card p-4 transition-all",
        "hover:shadow-sm hover:border-primary/30",
        selected
          ? "border-primary/30 bg-accent/50 shadow-sm"
          : "border-border"
      )}
    >
      {/* Row 1: icon + task name + priority */}
      <div className="flex items-center gap-2.5 mb-2">
        <CircleDot className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-semibold truncate flex-1">
          {task.task_type || "Task"}
        </span>
        <PriorityBadge priority={order?.priority || "low"} />
      </div>

      {/* Row 2: assignee + due + tags */}
      <div className="flex items-center gap-2 pl-[26px] flex-wrap">
        {task.assigned_to && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {task.assigned_to === "u1" ? "You" : task.assigned_to}
          </span>
        )}
        <TaskDueIndicator dueDate={task.due_date} />
        {tags.map((t) => (
          <Badge
            key={t}
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 leading-4",
              t === "Hold" && "bg-warning/10 text-warning border-warning/20",
              t === "QC" && "bg-muted text-muted-foreground border-border",
              t === "Split" && "bg-secondary text-secondary-foreground"
            )}
          >
            {t === "Split" && <Scissors className="h-2.5 w-2.5 mr-0.5" />}
            {t}
          </Badge>
        ))}
      </div>

      {/* Progressive disclosure: case details on select */}
      {selected && order && (
        <div className="mt-3 pl-[26px] text-xs text-muted-foreground space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <p>
            {order.case_type}
            {order.crown_type && <> · {order.crown_type}</>}
          </p>
          <p>
            {order.lab_type} · {order.design_level}
          </p>
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12 ml-auto rounded-full" />
      </div>
      <div className="flex items-center gap-2 pl-[26px]">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
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
        "border-r bg-card flex flex-col shrink-0 overflow-hidden w-64",
        className
      )}
    >
      {/* Task count bar */}
      <div className="px-4 py-2.5 border-b shrink-0">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {allTasks.length} task{allTasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {loading &&
          [1, 2, 3].map((i) => <TaskCardSkeleton key={i} />)
        }

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 px-3 text-center">
            <AlertCircle className="h-7 w-7 text-destructive/60 mb-2" />
            <p className="text-sm font-medium mb-1">Failed to load</p>
            <p className="text-xs text-muted-foreground">Please try again.</p>
          </div>
        )}

        {!loading && !error && allTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-3 text-center">
            <Inbox className="h-7 w-7 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium mb-1">No tasks</p>
            <p className="text-xs text-muted-foreground">Nothing assigned yet.</p>
          </div>
        )}

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
