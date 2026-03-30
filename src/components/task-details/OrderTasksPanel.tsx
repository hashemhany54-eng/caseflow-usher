import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Scissors, Inbox, AlertCircle, CircleDot, User, ChevronRight } from "lucide-react";
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
/* Task Card - Compact for non-active, expanded for active             */
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

  return (
    <button
      onClick={() => onSelect(task.id)}
      className={cn(
        "w-full text-left rounded-md border transition-all",
        selected
          ? "border-primary/30 bg-accent/60 shadow-sm p-3.5"
          : "border-transparent bg-transparent hover:bg-muted/50 p-2.5"
      )}
    >
      {selected ? (
        <>
          {/* Active task: full details */}
          <div className="flex items-center gap-2 mb-1.5">
            <CircleDot className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-sm font-semibold truncate flex-1">
              {task.task_type || "Task"}
            </span>
            <PriorityBadge priority={order?.priority || "low"} />
          </div>
          <div className="flex items-center gap-2 pl-[22px] flex-wrap">
            {task.assigned_to && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {task.assigned_to === "u1" ? "You" : task.assigned_to}
              </span>
            )}
            <TaskDueIndicator dueDate={task.due_date} />
          </div>
          {order && (
            <div className="mt-2 pl-[22px] text-[11px] text-muted-foreground space-y-0.5 animate-in fade-in duration-150">
              <p>{order.case_type}{order.crown_type && <> · {order.crown_type}</>}</p>
            </div>
          )}
        </>
      ) : (
        /* Non-active task: minimal row */
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
          <span className="text-xs text-muted-foreground truncate flex-1">
            {task.task_type || "Task"}
          </span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />
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
    <div className="rounded-md p-2.5 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-24" />
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
        "border-r bg-card flex flex-col shrink-0 overflow-hidden w-56",
        className
      )}
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
