import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersBar } from "@/components/TaskFiltersBar";
import { useOutletContext } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

export default function TasksPage() {
  const { tasks } = useApp();
  const { searchQuery } = useOutletContext<{searchQuery: string;}>();

  const [activeCategory, setActiveCategory] = useState("my_tasks");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labFilter, setLabFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  const taskTypes = useMemo(() => [...new Set(tasks.map((t) => t.task_type).filter(Boolean) as string[])], [tasks]);
  const labs = useMemo(() => [...new Set(tasks.map((t) => t.order?.lab_type).filter(Boolean) as string[])], [tasks]);

  const categoryFiltered = useMemo(() => {
    switch (activeCategory) {
      case "my_tasks":return tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped");
      case "completed":return tasks.filter((t) => t.status === "completed" || t.status === "skipped");
      case "assigned_others":return tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "");
      case "waiting_practice":return tasks.filter((t) => t.order?.status === "on_hold");
      case "all":return tasks;
      default:return tasks;
    }
  }, [tasks, activeCategory]);

  const sortedTasks = useMemo(() => {
    let filtered = categoryFiltered;
    const q = (searchQuery || localSearch).toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (t) =>
        t.order?.patient_name.toLowerCase().includes(q) ||
        t.order?.case_type.toLowerCase().includes(q) ||
        t.order_id.toLowerCase().includes(q)
      );
    }
    if (taskTypeFilter !== "all") filtered = filtered.filter((t) => t.task_type === taskTypeFilter);
    if (statusFilter !== "all") filtered = filtered.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all") filtered = filtered.filter((t) => t.order?.priority === priorityFilter);
    if (labFilter !== "all") filtered = filtered.filter((t) => t.order?.lab_type === labFilter);

    return filtered.sort((a, b) => {
      const now = Date.now();
      const aDiff = new Date(a.due_date).getTime() - now;
      const bDiff = new Date(b.due_date).getTime() - now;
      return aDiff - bDiff;
    });
  }, [categoryFiltered, searchQuery, localSearch, taskTypeFilter, statusFilter, priorityFilter, labFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex-1 overflow-auto px-4 py-0 md:px-[4px] pr-0 pl-[4px] mx-0">
        <h1 className="text-lg font-bold mb-1">Tasks</h1>
        <p className="text-xs text-muted-foreground mb-4">
          {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}
        </p>

        <TaskFiltersBar
          categoryFilter={activeCategory}
          taskTypeFilter={taskTypeFilter}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          labFilter={labFilter}
          localSearch={localSearch}
          onCategoryChange={setActiveCategory}
          onTaskTypeChange={setTaskTypeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onLabChange={setLabFilter}
          onLocalSearchChange={setLocalSearch}
          taskTypes={taskTypes}
          labs={labs} />
        

        {sortedTasks.length === 0 ?
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="h-10 w-10 mb-2 opacity-30" />
            <p className="font-medium text-sm">No tasks found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div> :

        <div className="flex flex-col gap-2">
            {sortedTasks.map((task, i) =>
          <TaskCard key={task.id} task={task} index={i} />
          )}
          </div>
        }
      </div>
    </div>);

}