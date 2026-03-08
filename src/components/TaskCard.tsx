import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { Scissors, RefreshCw } from "lucide-react";
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

export function TaskCard({ task, index }: {task: Task;index: number;}) {
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

  const priorityDot = order?.priority === "high" ?
  "bg-destructive" :
  order?.priority === "medium" ?
  "bg-warning" :
  "bg-muted-foreground/30";

  const designLevel = order?.design_level || "Standard";
  const levelNum = designLevel === "Advanced" ? "4" : designLevel === "Standard" ? "2" : "1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={`group cursor-pointer rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 transition-all ${borderClass}`}>
      
      {/* Desktop row */}
      <div className="hidden lg:flex items-stretch min-h-[80px]">
        {/* Task Type + Due + Flags */}
        <div className="flex flex-col justify-center gap-0.5 px-4 py-2.5 flex-[2] min-w-0 border-r border-border/50">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot}`} />
            <span className="font-semibold text-sm text-foreground">{task.task_type || "Task"}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Due: {new Date(task.due_date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}{" "}
            {new Date(task.due_date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
          <p className={`text-[11px] font-medium leading-tight ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
            {isOverdue ? timeLeft : isUrgent ? timeLeft : "On schedule"}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {order?.is_split &&
            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Scissors className="h-2.5 w-2.5" /> Split
              </span>
            }
            {order?.is_resubmitted &&
            <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive">
                <RefreshCw className="h-2.5 w-2.5" /> Resub
              </span>
            }
          </div>
        </div>

        {/* Patient */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 flex-[1.5] min-w-0 border-r border-border/50">
          <div className="h-8 w-8 rounded-full bg-success/20 text-success flex items-center justify-center text-[11px] font-semibold shrink-0">
            {order?.patient_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{order?.patient_name}</p>
            {order?.patient_age &&
            <p className="text-[11px] text-muted-foreground">{order.patient_age}y</p>
            }
          </div>
        </div>

        {/* Case Details */}
        <div className="flex flex-col justify-center px-4 py-2.5 flex-[2] min-w-0 border-r border-border/50">
          <span className="text-sm font-medium">
            {order?.crown_type ? `${order.crown_type}` : order?.case_type}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {order?.case_type} • {order?.design_level || "Level 1"}
          </p>
        </div>

        {/* Lab */}
        <div className="flex items-center justify-center px-3 py-2.5 w-[80px] shrink-0 border-r border-border/50">
          <span className="text-[11px] text-muted-foreground font-medium">{order?.lab_type}</span>
        </div>

        {/* Timeline Stepper */}
        <div className="flex items-center px-4 py-2.5 flex-[2] min-w-[380px]">
          <div className="flex w-full gap-4">
            {stages.map((stage) => {
              const done = completedStages.has(stage as any);
              const stageEvent = timeline.find((t) => t.stage === stage);
              return (
                <div key={stage} className="flex-1 flex flex-col gap-1">
                  <div
                    className={`h-[3px] w-full rounded-full ${
                    done ? "bg-foreground" : "bg-muted"}`
                    } />
                  
                  <span className="text-[11px] font-medium text-foreground leading-tight">
                    {stageLabels[stage]}
                  </span>
                  {stage === "order_placed" && orderPlacedEvent &&
                  <span className="text-[10px] text-muted-foreground leading-none">
                      {formatRelativeTime(orderPlacedEvent.timestamp)}
                    </span>
                  }
                  {stage === "design" && order?.designer_name &&
                  <span className="text-[10px] text-muted-foreground leading-none truncate">
                      {order.designer_name}
                    </span>
                  }
                  {stage === "qc" && order?.qc_reviewer &&
                  <span className="text-[10px] text-muted-foreground leading-none truncate">
                      {order.qc_reviewer}
                    </span>
                  }
                </div>);

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

        {/* Mini stepper - bar style */}
        <div className="flex gap-2">
          {stages.map((stage) => {
            const done = completedStages.has(stage as any);
            return (
              <div key={stage} className="flex-1 flex flex-col gap-0.5">
                <div className={`h-[2px] w-full rounded-full ${done ? "bg-foreground" : "bg-muted"}`} />
                <span className="text-[9px] text-muted-foreground leading-tight">{stageLabels[stage]}</span>
              </div>);

          })}
        </div>

        <div className="flex items-center gap-1">
          {order?.is_split &&
          <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <Scissors className="h-2.5 w-2.5" /> Split
            </span>
          }
          {order?.is_resubmitted &&
          <span className="inline-flex items-center gap-0.5 text-[9px] text-destructive">
              <RefreshCw className="h-2.5 w-2.5" /> Resub
            </span>
          }
        </div>
      </div>
    </motion.div>);

}
