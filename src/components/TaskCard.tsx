import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const statusProgress: Record<string, number> = {
  pending: 20,
  in_progress: 55,
  completed: 100,
  skipped: 0,
};

export function TaskCard({ task, index }: { task: Task; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const order = task.order;

  const borderClass = isOverdue ? "priority-overdue" : isUrgent ? "priority-urgent" : "priority-normal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className={`group cursor-pointer rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20 ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm truncate">{order?.patient_name}</h3>
            {order?.is_resubmitted && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] px-1.5 py-0 gap-0.5">
                <RefreshCw className="h-2.5 w-2.5" />
                Resubmitted
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{order?.case_type}</p>
        </div>
        <PriorityBadge priority={order?.priority || "low"} />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Clock className={`h-3 w-3 ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : ""}`} />
          <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : ""}>
            {timeLeft}
          </span>
        </div>
        <span>•</span>
        <span>{order?.lab_type}</span>
        <span>•</span>
        <span>{order?.id}</span>
      </div>

      <Progress value={statusProgress[task.status]} className="h-1" />
    </motion.div>
  );
}
