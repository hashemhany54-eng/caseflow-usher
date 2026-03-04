import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { PauseCircle } from "lucide-react";

export default function OnHoldPage() {
  const { tasks } = useApp();
  const onHold = tasks.filter((t) => t.order?.status === "on_hold");

  return (
    <div>
      <h1 className="text-lg font-bold mb-1">On Hold</h1>
      <p className="text-xs text-muted-foreground mb-4">{onHold.length} cases on hold</p>
      {onHold.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <PauseCircle className="h-10 w-10 mb-2 opacity-30" />
          <p className="font-medium text-sm">No cases on hold</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {onHold.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
