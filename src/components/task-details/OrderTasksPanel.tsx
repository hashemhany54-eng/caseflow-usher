import { useState, useEffect } from "react";
import { Task, Order } from "@/types";
import { useApp } from "@/context/AppContext";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ClipboardList,
  AlertCircle,
  User,
  Clock,
  Scissors,
  ShieldCheck,
  Pause,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ── Single task row ─────────────────────────────────────────────── */

function TaskRow({
  task,
  isSelected,
  onSelect,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const urgencyClass = isOverdue
    ? "text-destructive"
    : isUrgent
    ? "text-warning"
    : "text-muted-foreground";

  const urgencyLabel = isOverdue
    ? "Overdue"
    : isUrgent
    ? "Due soon"
    : "On track";

  const tags: { label: string; icon: React.ReactNode }[] = [];
  if (order?.is_split) tags.push({ label: "Split", icon: <Scissors className="h-2.5 w-2.5" /> });
  if (order?.qc_required) tags.push({ label: "QC", icon: <ShieldCheck className="h-2.5 w-2.5" /> });
  if (order?.status === "on_hold") tags.push({ label: "Hold", icon: <Pause className="h-2.5 w-2.5" /> });

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-all duration-150 group",
        isSelected
          ? "border-primary/40 bg-accent shadow-sm"
          : "border-border/60 bg-card hover:border-primary/20 hover:shadow-sm"
      )}
    >
      {/* Row 1: name + priority */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold truncate">{task.task_type || "Task"}</span>
        {order && <PriorityBadge priority={order.priority} />}
      </div>

      {/* Row 2: assignee + due */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-1.5">
        <span className="flex items-center gap-1 truncate">
          <User className="h-3 w-3 shrink-0" />
          {task.assigned_to || "Unassigned"}
        </span>
        <span className={cn("flex items-center gap-1 shrink-0 font-medium", urgencyClass)}>
          <Clock className="h-3 w-3" />
          {timeLeft || urgencyLabel}
        </span>
      </div>

      {/* Row 3: urgency pill + tags (progressive disclosure) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] px-1.5 py-0 font-semibold border",
            isOverdue
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : isUrgent
              ? "border-warning/30 bg-warning/10 text-warning"
              : "border-border bg-muted/50 text-muted-foreground"
          )}
        >
          {urgencyLabel}
        </Badge>
        {tags.map((t) => (
          <Badge
            key={t.label}
            variant="outline"
            className="text-[9px] px-1.5 py-0 gap-0.5 border-border bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {t.icon}
            {t.label}
          </Badge>
        ))}
      </div>
    </button>
  );
}

/* ── Inline detail for selected task ─────────────────────────────── */

function TaskInlineDetail({ task }: { task: Task }) {
  const order = task.order;
  const rows = [
    { label: "Status", value: task.status.replace("_", " ") },
    { label: "Assigned", value: task.assigned_to || "Unassigned" },
    { label: "Patient", value: order?.patient_name },
    { label: "Case", value: order?.case_type },
    { label: "Material", value: order?.lab_type },
    { label: "Designer", value: order?.designer_name || "—" },
  ].filter((r) => r.value);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="overflow-hidden"
    >
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 mt-1 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-medium capitalize">{r.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main panel ──────────────────────────────────────────────────── */

export function OrderTasksPanel({ orderId }: { orderId: string }) {
  const { tasks } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const orderTasks = tasks.filter((t) => t.order_id === orderId);

  // Simulate async load
  useEffect(() => {
    setLoading(true);
    setError(false);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [orderId]);

  /* ── Loading skeleton ──────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="w-72 border-l bg-card flex flex-col shrink-0 overflow-hidden">
        <div className="h-14 flex items-center px-4 border-b">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="p-3 space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border/40 p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="w-72 border-l bg-card flex flex-col shrink-0 overflow-hidden">
        <div className="h-14 flex items-center px-4 border-b">
          <span className="text-sm font-semibold">Tasks</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive/40 mb-2" />
          <p className="text-xs text-muted-foreground">Failed to load tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-l bg-card flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="h-14 flex items-center justify-between px-4 border-b shrink-0 hover:bg-muted/30 transition-colors w-full text-left"
      >
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Workflow</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-semibold">
            {orderTasks.length}
          </Badge>
        </div>
        {collapsed ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Task list */}
      {!collapsed && (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {/* Empty state */}
            {orderTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ClipboardList className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No tasks for this order</p>
              </div>
            )}

            {orderTasks.map((task) => (
              <div key={task.id}>
                <TaskRow
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onSelect={() =>
                    setSelectedTaskId((prev) => (prev === task.id ? null : task.id))
                  }
                />
                <AnimatePresence>
                  {selectedTaskId === task.id && <TaskInlineDetail task={task} />}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
