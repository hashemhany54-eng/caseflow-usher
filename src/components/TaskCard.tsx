import { Task } from "@/types";
import { useCountdown } from "@/hooks/useCountdown";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, RefreshCw, Scissors, User, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [expanded, setExpanded] = useState(false);

  const borderClass = isOverdue ? "priority-overdue" : isUrgent ? "priority-urgent" : "priority-normal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={`group rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20 ${borderClass}`}
    >
      {/* Clickable main area */}
      <div onClick={() => navigate(`/tasks/${task.id}`)} className="cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{order?.patient_name}</h3>
              {order?.patient_age && (
                <span className="text-[10px] text-muted-foreground">{order.patient_age}y {order.patient_gender?.[0]}</span>
              )}
              {order?.is_resubmitted && (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] px-1.5 py-0 gap-0.5">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Resub
                </Badge>
              )}
              {order?.is_split && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px] px-1.5 py-0 gap-0.5">
                  <Scissors className="h-2.5 w-2.5" />
                  Split
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{order?.case_type} • {order?.crown_type}</p>
          </div>
          <PriorityBadge priority={order?.priority || "low"} />
        </div>

        {/* Key info row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
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

        {/* Designer & Task type */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{order?.designer_name || "Unassigned"}</span>
          </div>
          {task.task_type && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{task.task_type}</Badge>
          )}
        </div>

        {/* QC indicators */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {order?.qc_required && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">QC</Badge>
          )}
          {order?.double_qc && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">Double QC</Badge>
          )}
          {order?.design_level && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{order.design_level}</Badge>
          )}
          {order?.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
          ))}
        </div>

        <Progress value={statusProgress[task.status]} className="h-1" />
      </div>

      {/* Expandable secondary info */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2 hover:text-foreground transition-colors w-full justify-center"
      >
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? "Less" : "More"}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-2 pt-2 border-t space-y-1 text-[11px] text-muted-foreground"
        >
          <div className="flex justify-between"><span>Shipping</span><span className="text-foreground">{order?.shipping_type || "—"}</span></div>
          <div className="flex justify-between"><span>Scanner</span><span className="text-foreground">{order?.scanner || "—"}</span></div>
          <div className="flex justify-between"><span>App Source</span><span className="text-foreground">{order?.app_source || "—"}</span></div>
          <div className="flex justify-between"><span>Laptop</span><span className="text-foreground">{order?.laptop || "—"}</span></div>
          <div className="flex justify-between"><span>Design Preview</span><span className="text-foreground">{order?.design_preview ? "Yes" : "No"}</span></div>
        </motion.div>
      )}
    </motion.div>
  );
}
