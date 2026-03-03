import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { PauseCircle } from "lucide-react";

export default function OnHoldPage() {
  const { tasks } = useApp();
  const onHold = tasks.filter((t) => t.order?.status === "on_hold");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">On Hold</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{onHold.length} cases on hold</p>
      </div>
      {onHold.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <PauseCircle className="h-12 w-12 mb-3 opacity-30" />
          <p className="font-medium">No cases on hold</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {onHold.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
