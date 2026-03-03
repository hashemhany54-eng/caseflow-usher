import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { CheckCircle2 } from "lucide-react";

export default function CompletedPage() {
  const { tasks } = useApp();
  const completed = tasks.filter((t) => t.status === "completed" || t.status === "skipped");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Completed</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{completed.length} completed tasks</p>
      </div>
      {completed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mb-3 opacity-30" />
          <p className="font-medium">No completed tasks yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {completed.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
