import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Scissors } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TaskListSidebar() {
  const { tasks } = useApp();
  const { taskId } = useParams();
  const navigate = useNavigate();

  return (
    <ScrollArea className="flex-1">
      <div className="py-1">
        {tasks.map((task) => {
          const order = task.order;
          const isActive = task.id === taskId;
          return (
            <button
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-muted/50",
                isActive && "bg-primary/5 border-l-2 border-l-primary"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium truncate">
                  {task.task_type || "Design review"}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {order?.id}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {order && <PriorityBadge priority={order.priority} />}
                <span className="text-sm font-medium truncate">
                  {order?.patient_name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                {order?.is_split && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 gap-0.5">
                    <Scissors className="h-2 w-2" /> Split
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
