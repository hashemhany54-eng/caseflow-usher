import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { CheckCircle2 } from "lucide-react";

export default function CompletedPage() {
  const { tasks } = useApp();
  const completed = tasks.filter((t) => t.status === "completed" || t.status === "skipped");

  return (
    <div>
      
      <p className="text-xs text-muted-foreground mb-4">{completed.length} completed tasks</p>
      {completed.length === 0 ?
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <CheckCircle2 className="h-10 w-10 mb-2 opacity-30" />
          <p className="font-medium text-sm">No completed tasks yet</p>
        </div> :

      <div className="flex flex-col gap-2">
          {completed.map((task, i) =>
        <TaskCard key={task.id} task={task} index={i} />
        )}
        </div>
      }
    </div>);

}