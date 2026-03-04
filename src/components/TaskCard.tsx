import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { Badge } from "@/components/ui/badge";
import { Scissors, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockTimeline } from "@/data/mockData";

const stages = ["order_placed", "design", "qc", "preview", "model"];
const stageLabels: Record<string, string> = {
  order_placed: "Order Placed",
  design: "Design",
  qc: "QC",
  preview: "Design Preview",
  model: "Model",
};

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const timeline = mockTimeline[order?.id || ""] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));

  // Find the latest completed stage's info
  const lastTimelineEvent = timeline.length > 0 ? timeline[timeline.length - 1] : null;
  const orderPlacedEvent = timeline.find((t) => t.stage === "order_placed");

  const borderClass = isOverdue ? "priority-overdue" : isUrgent ? "priority-urgent" : "priority-normal";

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  // Priority dot color
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
      className={`group cursor-pointer rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 transition-all ${borderClass}`}
    >
      <div className="flex items-stretch min-h-[80px]">
        {/* Section 1: Task Type + Due + Flags */}
        <div className="flex flex-col justify-center gap-1 px-4 py-3 min-w-[180px] w-[200px] shrink-0 border-r border-border/50">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-sm text-foreground">{task.task_type || "Task"}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Due to lab: {new Date(task.due_date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}{" "}
            {new Date(task.due_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
          <p className={`text-[11px] font-medium ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue ? timeLeft : isUrgent ? timeLeft : "No task expiration"}
          </p>
          {/* Flags */}
          <div className="flex items-center gap-1 mt-0.5">
            {order?.is_split && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Scissors className="h-3 w-3" /> Split
              </span>
            )}
            {order?.is_resubmitted && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive">
                <RefreshCw className="h-3 w-3" /> Resub
              </span>
            )}
          </div>
        </div>

        {/* Section 2: Patient Name + Avatar */}
        <div className="flex items-center gap-2.5 px-4 py-3 min-w-[140px] w-[160px] shrink-0 border-r border-border/50">
          <div className="h-8 w-8 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{order?.patient_name}</p>
            {order?.patient_age && (
              <p className="text-[11px] text-muted-foreground">{order.patient_age}y</p>
            )}
          </div>
        </div>

        {/* Section 3: Case Details */}
        <div className="flex flex-col justify-center px-4 py-3 min-w-[220px] flex-1 border-r border-border/50">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">
              {order?.crown_type ? `${order.crown_type}` : order?.case_type}
            </span>
            {order?.case_type && order?.crown_type && (
              <span className="text-[11px] text-muted-foreground">({order.id.split("-").pop()})</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            • {order?.case_type}
          </p>
          <p className="text-[11px] text-muted-foreground">
            • {order?.case_type} C&B {order?.design_level || "Level 1"}, Waxup Level 1
          </p>
        </div>

        {/* Section 4: Lab Type */}
        <div className="flex items-center justify-center px-3 py-3 min-w-[70px] w-[80px] shrink-0 border-r border-border/50">
          <span className="text-xs text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        {/* Section 5: Timeline Stepper */}
        <div className="flex items-center px-4 py-3 min-w-[360px] flex-1">
          <div className="flex items-center w-full gap-0">
            {stages.map((stage, i) => {
              const done = completedStages.has(stage as any);
              const isActive = done && !completedStages.has(stages[i + 1] as any) && i < stages.length - 1;
              return (
                <div key={stage} className="flex items-center flex-1">
                  <div className="flex flex-col items-center min-w-[50px]">
                    <div
                      className={`h-3 w-3 rounded-full border-2 transition-colors ${
                        done
                          ? "bg-success border-success"
                          : "bg-card border-muted-foreground/30"
                      }`}
                    />
                    <span className="text-[9px] mt-1 text-muted-foreground text-center leading-tight whitespace-nowrap">
                      {stageLabels[stage]}
                    </span>
                    {/* Show info under specific stages */}
                    {stage === "order_placed" && orderPlacedEvent && (
                      <span className="text-[9px] text-muted-foreground">
                        {formatRelativeTime(orderPlacedEvent.timestamp)}
                      </span>
                    )}
                    {stage === "design" && order?.designer_name && (
                      <span className="text-[9px] text-muted-foreground truncate max-w-[70px]">
                        {order.designer_name}
                      </span>
                    )}
                    {stage === "qc" && order?.designer_name && (
                      <span className="text-[9px] text-muted-foreground truncate max-w-[70px]">
                        {order.designer_name}
                      </span>
                    )}
                  </div>
                  {i < stages.length - 1 && (
                    <div className={`flex-1 h-px mx-0.5 ${done ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
