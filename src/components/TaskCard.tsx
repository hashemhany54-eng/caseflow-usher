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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={`group rounded-lg border bg-card transition-all hover:shadow-md hover:border-primary/20 ${borderClass}`}
    >
      {/* Main row - clickable */}
      <div
        onClick={() => navigate(`/tasks/${task.id}`)}
        className="cursor-pointer flex items-center gap-4 px-4 py-3"
      >
        {/* Patient info */}
        <div className="flex items-center gap-2 min-w-[180px] w-[180px] shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm truncate">{order?.patient_name}</h3>
              {order?.patient_age && (
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {order.patient_age}y {order.patient_gender?.[0]}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{order?.id}</p>
          </div>
        </div>

        {/* Case & Crown */}
        <div className="min-w-[120px] w-[120px] shrink-0">
          <p className="text-xs font-medium truncate">{order?.case_type}</p>
          <p className="text-[11px] text-muted-foreground truncate">{order?.crown_type || "—"}</p>
        </div>

        {/* Lab */}
        <div className="min-w-[80px] w-[80px] shrink-0">
          <p className="text-xs text-muted-foreground">{order?.lab_type}</p>
        </div>

        {/* Designer */}
        <div className="flex items-center gap-1 min-w-[100px] w-[100px] shrink-0">
          <User className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">{order?.designer_name || "Unassigned"}</span>
        </div>

        {/* Task Type */}
        <div className="min-w-[100px] w-[100px] shrink-0">
          {task.task_type && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{task.task_type}</Badge>
          )}
        </div>

        {/* Due time */}
        <div className="flex items-center gap-1 min-w-[90px] w-[90px] shrink-0">
          <Clock className={`h-3 w-3 ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`} />
          <span className={`text-xs ${isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}`}>
            {timeLeft}
          </span>
        </div>

        {/* Priority */}
        <div className="shrink-0">
          <PriorityBadge priority={order?.priority || "low"} />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1 shrink-0">
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
          {order?.qc_required && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20">QC</Badge>
          )}
          {order?.double_qc && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">2×QC</Badge>
          )}
        </div>

        {/* Progress */}
        <div className="min-w-[60px] w-[60px] shrink-0">
          <Progress value={statusProgress[task.status]} className="h-1" />
        </div>

        {/* Expand toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="p-1 hover:bg-secondary rounded transition-colors shrink-0"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>

      {/* Expandable details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-3 border-t"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-1.5 pt-2.5 text-[11px]">
            <div><span className="text-muted-foreground">Design Level</span><p className="text-foreground">{order?.design_level || "—"}</p></div>
            <div><span className="text-muted-foreground">Shipping</span><p className="text-foreground">{order?.shipping_type || "—"}</p></div>
            <div><span className="text-muted-foreground">Scanner</span><p className="text-foreground">{order?.scanner || "—"}</p></div>
            <div><span className="text-muted-foreground">App Source</span><p className="text-foreground">{order?.app_source || "—"}</p></div>
            <div><span className="text-muted-foreground">Laptop</span><p className="text-foreground">{order?.laptop || "—"}</p></div>
            <div><span className="text-muted-foreground">Preview</span><p className="text-foreground">{order?.design_preview ? "Yes" : "No"}</p></div>
            {order?.tags && order.tags.length > 0 && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Tags</span>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {order.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
