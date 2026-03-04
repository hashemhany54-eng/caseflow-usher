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
  model: "Model",
};

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const timeline = mockTimeline[order?.id || ""] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));

  const orderPlacedEvent = timeline.find((t) => t.stage === "order_placed");

  const borderClass = isOverdue ? "priority-overdue" : isUrgent ? "priority-urgent" : "priority-normal";

  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const priorityDot = order?.priority === "high"
    ? "bg-destructive"
    : order?.priority === "medium"
    ? "bg-warning"
    : "bg-muted-foreground/30";

  // Extract design level number
  const designLevel = order?.design_level || "Standard";
  const levelNum = designLevel === "Advanced" ? "4" : designLevel === "Standard" ? "2" : "1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={`group cursor-pointer rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 transition-all ${borderClass}`}
    >
      {/* Desktop row */}
      <div className="hidden lg:flex items-stretch min-h-[72px]">
        {/* Designer Level */}
        <div className="flex items-center justify-center px-3 py-2 w-[52px] shrink-0 border-r border-border/50">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-muted-foreground leading-none">LVL</span>
            <span className="text-sm font-bold text-foreground">{levelNum}</span>
          </div>
        </div>

        {/* Task Type + Due + Flags */}
        <div className="flex flex-col justify-center gap-0.5 px-3 py-2 min-w-[164px] w-[180px] shrink-0 border-r border-border/50">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-xs text-foreground">{task.task_type || "Task"}</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Due: {new Date(task.due_date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}{" "}
            {new Date(task.due_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
          <p className={`text-[10px] font-medium leading-tight ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
          </p>
          <div className="flex items-center gap-1">
            {order?.is_split && (
              <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
                <Scissors className="h-2.5 w-2.5" /> Split
              </span>
            )}
            {order?.is_resubmitted && (
              <span className="inline-flex items-center gap-0.5 text-[9px] text-destructive">
                <RefreshCw className="h-2.5 w-2.5" /> Resub
              </span>
            )}
          </div>
        </div>

        {/* Patient */}
        <div className="flex items-center gap-2 px-3 py-2 min-w-[132px] w-[148px] shrink-0 border-r border-border/50">
          <div className="h-7 w-7 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{order?.patient_name}</p>
            {order?.patient_age && (
              <p className="text-[10px] text-muted-foreground">{order.patient_age}y</p>
            )}
          </div>
        </div>

        {/* Case Details */}
        <div className="flex flex-col justify-center px-3 py-2 min-w-[180px] flex-1 border-r border-border/50">
          <span className="text-xs font-medium">
            {order?.crown_type ? `${order.crown_type}` : order?.case_type}
          </span>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {order?.case_type} • {order?.design_level || "Level 1"}
          </p>
        </div>

        {/* Lab */}
        <div className="flex items-center justify-center px-2 py-2 w-[68px] shrink-0 border-r border-border/50">
          <span className="text-[10px] text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        {/* Timeline Stepper - pill style */}
        <div className="flex items-center px-3 py-2 min-w-[300px] flex-1">
          <div className="flex items-center w-full">
            {stages.map((stage, i) => {
              const done = completedStages.has(stage as any);
              return (
                <div key={stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-0.5 min-w-[44px]">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center transition-colors ${
                        done
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-[9px] font-medium">{i + 1}</span>
                      )}
                    </div>
                    <span className="text-[8px] text-muted-foreground text-center leading-tight whitespace-nowrap">
                      {stageLabels[stage]}
                    </span>
                    {stage === "order_placed" && orderPlacedEvent && (
                      <span className="text-[8px] text-muted-foreground leading-none">
                        {formatRelativeTime(orderPlacedEvent.timestamp)}
                      </span>
                    )}
                    {stage === "design" && order?.designer_name && (
                      <span className="text-[8px] text-muted-foreground truncate max-w-[56px] leading-none">
                        {order.designer_name}
                      </span>
                    )}
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-0.5 rounded-full ${done ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet responsive layout */}
      <div className="lg:hidden p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded bg-muted text-[10px] font-bold">
              {levelNum}
            </div>
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-xs text-foreground">{task.task_type || "Task"}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{order?.patient_name}</p>
            <p className="text-[10px] text-muted-foreground">
              {order?.crown_type || order?.case_type} • {order?.design_level || "Level 1"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground">
              Due {new Date(task.due_date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}
            </p>
            <p className={`text-[10px] font-medium ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
            </p>
          </div>
        </div>

        {/* Mini stepper */}
        <div className="flex items-center gap-0.5">
          {stages.map((stage, i) => {
            const done = completedStages.has(stage as any);
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className={`h-1.5 flex-1 rounded-full ${done ? "bg-success" : "bg-border"}`} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          {order?.is_split && (
            <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <Scissors className="h-2.5 w-2.5" /> Split
            </span>
          )}
          {order?.is_resubmitted && (
            <span className="inline-flex items-center gap-0.5 text-[9px] text-destructive">
              <RefreshCw className="h-2.5 w-2.5" /> Resub
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
