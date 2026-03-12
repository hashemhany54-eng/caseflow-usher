import { useState, useEffect } from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleDot,
  Inbox,
  AlertCircle,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Task Row                                                            */
/* ------------------------------------------------------------------ */

function TaskDueIndicator({ dueDate }: { dueDate: string }) {
  const { timeLeft, isOverdue, isUrgent } = useCountdown(dueDate);

  return (
    <span
      className={cn(
        "text-[11px] font-medium whitespace-nowrap",
        isOverdue && "text-destructive",
        isUrgent && "text-warning",
        !isOverdue && !isUrgent && "text-muted-foreground"
      )}
    >
      {timeLeft}
    </span>
  );
}

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  in_progress: <CircleDot className="h-3.5 w-3.5 text-primary" />,
  pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  skipped: <AlertTriangle className="h-3.5 w-3.5 text-warning" />,
};

function TaskRow({
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
        "w-full text-left px-4 py-3 border-b border-border/40 transition-colors group",
        "hover:bg-accent/60",
        selected && "bg-accent ring-1 ring-primary/20"
      )}
    >
      {/* Row 1: icon + name + priority */}
      <div className="flex items-center gap-2 mb-1">
        {statusIcon[task.status] || statusIcon.pending}
        <span className="text-sm font-medium truncate flex-1">
          {task.task_type || "Task"}
        </span>
        <PriorityBadge priority={order?.priority || "low"} />
      </div>

      {/* Row 2: assignee + due + tags */}
      <div className="flex items-center gap-2 pl-[22px] flex-wrap">
        {task.assigned_to && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
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
              "text-[9px] px-1.5 py-0 leading-4",
              t === "Hold" && "bg-warning/10 text-warning border-warning/20",
              t === "QC" && "bg-primary/10 text-primary border-primary/20",
              t === "Split" && "bg-secondary text-secondary-foreground"
            )}
          >
            {t}
          </Badge>
        ))}
      </div>

      {/* Inline detail on select (progressive disclosure) */}
      {selected && order && (
        <div className="mt-2 pl-[22px] text-[11px] text-muted-foreground space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
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

function TaskRowSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-border/40 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-4 w-12 ml-auto rounded-full" />
      </div>
      <div className="flex items-center gap-2 pl-[22px]">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

interface OrderTasksPanelProps {
  orderId: string;
  className?: string;
}

export function OrderTasksPanel({ orderId, className }: OrderTasksPanelProps) {
  const { tasks } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Simulate async load
  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [orderId]);

  const orderTasks = tasks.filter((t) => t.order_id === orderId);

  return (
    <div
      className={cn(
        "border-l bg-card flex flex-col shrink-0 overflow-hidden transition-all",
        collapsed ? "w-0 lg:w-10" : "w-full lg:w-72 xl:w-80",
        className
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b shrink-0">
        {!collapsed && (
          <h2 className="text-sm font-semibold font-display">Workflow</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-muted-foreground"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
          ) : (
            <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div>
              {[1, 2, 3].map((i) => (
                <TaskRowSkeleton key={i} />
              ))}
            </div>
          )}

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
          {!loading && !error && orderTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium mb-1">No tasks</p>
              <p className="text-xs text-muted-foreground">
                No workflow tasks for this order yet.
              </p>
            </div>
          )}

          {/* Task list */}
          {!loading && !error && orderTasks.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-border/40">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {orderTasks.length} task{orderTasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              {orderTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  selected={selectedTaskId === task.id}
                  onSelect={setSelectedTaskId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
