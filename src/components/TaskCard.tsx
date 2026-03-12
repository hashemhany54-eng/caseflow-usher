import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { Scissors, RefreshCw, Check, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockTimeline } from "@/data/mockData";

const stages = ["order_placed", "design", "qc", "preview", "model"];
const stageLabels: Record<string, string> = {
  order_placed: "Ordered",
  design: "Design",
  qc: "QC",
  preview: "Preview",
  model: "Model"
};

/** Shared grid for every row – import in header if needed */
export const TASK_ROW_GRID = "grid grid-cols-[200px_180px_1fr_120px_minmax(280px,2fr)_48px]";

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const timeline = mockTimeline[order?.id || ""] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));
  const timelineByStage = Object.fromEntries(timeline.map((t) => [t.stage, t]));
  const latestStage = [...stages].reverse().find((s) => completedStages.has(s as any));

  const borderClass = isOverdue ? "priority-overdue" : isUrgent ? "priority-urgent" : "priority-normal";

  const priorityDot = order?.priority === "high"
    ? "bg-destructive"
    : order?.priority === "medium"
    ? "bg-warning"
    : "bg-muted-foreground/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={`group cursor-pointer rounded-lg border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 ${borderClass}`}
    >
      {/* Desktop row — shared grid */}
      <div
        className="hidden lg:grid items-center min-h-[68px]"
        style={{ gridTemplateColumns: "200px 180px 1fr 120px minmax(280px, 2fr) 48px" }}
      >
        {/* 1 · Status */}
        <div className="flex flex-col justify-center gap-0.5 px-4 py-3 border-r border-border/40 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-sm text-foreground truncate">{task.task_type || "Task"}</span>
          </div>
          <p className={`text-xs font-medium leading-tight ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
          </p>
          <div className="hidden group-hover:block text-[11px] text-muted-foreground mt-0.5">
            {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
            {new Date(task.due_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </div>
        </div>

        {/* 2 · Patient */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-r border-border/40 min-w-0">
          <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{order?.patient_name}</p>
            <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {order?.patient_age && `${order.patient_age}y`}
            </p>
          </div>
        </div>

        {/* 3 · Product name */}
        <div className="flex flex-col justify-center px-4 py-3 border-r border-border/40 min-w-0">
          <span className="text-sm font-medium truncate">{order?.crown_type || order?.case_type}</span>
          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 truncate">
            {order?.case_type} · {order?.design_level || "Level 1"}
          </p>
        </div>

        {/* 4 · Material code */}
        <div className="flex items-center justify-center px-3 py-3 border-r border-border/40">
          <span className="text-xs text-muted-foreground font-medium truncate">{order?.lab_type}</span>
        </div>

        {/* 5 · Timeline */}
        <div className="flex items-center px-4 py-3 min-w-0">
          <div className="flex w-full gap-2">
            {stages.map((stage) => {
              const done = completedStages.has(stage as any);
              const isLatest = stage === latestStage;
              const event = timelineByStage[stage];
              return (
                <div key={stage} className="flex-1 flex flex-col gap-1 min-w-0 group/step">
                  <div className={`h-[3px] w-full rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
                  {isLatest ? (
                    <>
                      <span className="text-[10px] font-medium text-primary leading-tight truncate">
                        {stageLabels[stage]}
                      </span>
                      {event && (
                        <span className="text-[9px] text-muted-foreground leading-none truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.assignee
                            ? event.due ? `${event.assignee} — ${event.due}` : event.assignee
                            : event.action_by}
                        </span>
                      )}
                    </>
                  ) : done ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        <Check className="h-3 w-3 text-primary/50 block group-hover:hidden" />
                        <span className="text-[9px] text-muted-foreground/60 hidden group-hover:block truncate">
                          {stageLabels[stage]}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/50 leading-none truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {event?.assignee || event?.action_by || ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-[9px] text-muted-foreground/40 leading-tight truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {stageLabels[stage]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 · Action icon (always reserved) */}
        <div className="flex items-center justify-center py-3">
          {(order?.is_split || order?.is_resubmitted) ? (
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              {order?.is_split && <Scissors className="h-3.5 w-3.5 text-muted-foreground" />}
              {order?.is_resubmitted && <RefreshCw className="h-3.5 w-3.5 text-destructive" />}
            </div>
          ) : (
            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/40 transition-colors" />
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-xs text-foreground">{task.task_type || "Task"}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{order?.patient_name}</p>
            <p className="text-[10px] text-muted-foreground">{order?.crown_type || order?.case_type}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          {stages.map((stage) => {
            const done = completedStages.has(stage as any);
            return (
              <div key={stage} className="flex-1">
                <div className={`h-[2px] w-full rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
