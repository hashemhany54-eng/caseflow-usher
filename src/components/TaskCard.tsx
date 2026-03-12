import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { Scissors, RefreshCw, Check } from "lucide-react";
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

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const timeline = mockTimeline[order?.id || ""] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));

  // Find the latest completed stage for the label
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
      {/* Desktop row */}
      <div className="hidden lg:flex items-stretch min-h-[72px]">
        {/* Task Type + Priority */}
        <div className="flex flex-col justify-center gap-1 px-5 py-4 w-[180px] shrink-0 border-r border-border/40">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-sm text-foreground">{task.task_type || "Task"}</span>
          </div>
          <p className={`text-xs font-medium leading-tight ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
          </p>
          {/* Hover-revealed details */}
          <div className="hidden group-hover:block text-[11px] text-muted-foreground mt-0.5 transition-all">
            {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
            {new Date(task.due_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </div>
        </div>

        {/* Patient */}
        <div className="flex items-center gap-3 px-5 py-4 flex-[1.5] min-w-0 border-r border-border/40">
          <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{order?.patient_name}</p>
            <p className="text-xs text-muted-foreground">
              {order?.patient_age && `${order.patient_age}y`}
            </p>
          </div>
        </div>

        {/* Case Details */}
        <div className="flex flex-col justify-center px-5 py-4 flex-[2] min-w-0 border-r border-border/40">
          <span className="text-sm font-medium">
            {order?.crown_type || order?.case_type}
          </span>
          {/* Hover-revealed extra info */}
          <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5">
            {order?.case_type} · {order?.design_level || "Level 1"}
          </p>
        </div>

        {/* Lab - compact */}
        <div className="flex items-center justify-center px-4 py-4 flex-[0.6] min-w-0 border-r border-border/40">
          <span className="text-xs text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        {/* Minimal Timeline: checkmarks + final label */}
        <div className="flex items-center px-5 py-4 flex-[4] min-w-0">
          <div className="flex items-center w-full gap-1">
            {stages.map((stage, i) => {
              const done = completedStages.has(stage as any);
              const isLast = i === stages.length - 1;
              const isLatest = stage === latestStage;
              return (
                <div key={stage} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    {/* Progress bar */}
                    <div className={`h-[3px] w-full rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
                    {/* Only show label for latest completed stage, rest show mini checkmarks or nothing */}
                    {isLatest ? (
                      <span className="text-[11px] font-medium text-primary leading-tight whitespace-nowrap">
                        {stageLabels[stage]}
                      </span>
                    ) : done ? (
                      <Check className="h-3 w-3 text-primary/60" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                        {stageLabels[stage]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flags - hover revealed */}
        {(order?.is_split || order?.is_resubmitted) && (
          <div className="flex items-center gap-1.5 px-4 py-4 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
            {order?.is_split && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Scissors className="h-2.5 w-2.5" />
              </span>
            )}
            {order?.is_resubmitted && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive">
                <RefreshCw className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        )}
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
            <p className="text-[10px] text-muted-foreground">
              {order?.crown_type || order?.case_type}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
            </p>
          </div>
        </div>

        {/* Mini stepper */}
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
