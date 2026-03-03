import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { useOutletContext } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useMemo } from "react";

export default function TasksPage() {
  const { tasks } = useApp();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const sortedTasks = useMemo(() => {
    let filtered = tasks.filter((t) => t.status !== "completed" && t.status !== "skipped");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.order?.patient_name.toLowerCase().includes(q) ||
          t.order?.case_type.toLowerCase().includes(q) ||
          t.order_id.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      const now = Date.now();
      const aDiff = new Date(a.due_date).getTime() - now;
      const bDiff = new Date(b.due_date).getTime() - now;
      // Overdue first (negative), then by closest due
      return aDiff - bDiff;
    });
  }, [tasks, searchQuery]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {sortedTasks.length} active {sortedTasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mb-3 opacity-30" />
          <p className="font-medium">No tasks assigned</p>
          <p className="text-sm">Set your status to Active to receive new cases</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
