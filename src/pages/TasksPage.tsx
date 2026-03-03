import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersBar } from "@/components/TaskFiltersBar";
import { TaskCategorySidebar } from "@/components/TaskCategorySidebar";
import { useOutletContext } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

export default function TasksPage() {
  const { tasks } = useApp();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const [activeCategory, setActiveCategory] = useState("my_tasks");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labFilter, setLabFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  const taskTypes = useMemo(() => [...new Set(tasks.map((t) => t.task_type).filter(Boolean) as string[])], [tasks]);
  const labs = useMemo(() => [...new Set(tasks.map((t) => t.order?.lab_type).filter(Boolean) as string[])], [tasks]);

  // Category filtering
  const categoryFiltered = useMemo(() => {
    switch (activeCategory) {
      case "my_tasks": return tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped");
      case "completed": return tasks.filter((t) => t.status === "completed" || t.status === "skipped");
      case "assigned_others": return tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "");
      case "unassigned": return tasks.filter((t) => !t.assigned_to);
      case "waiting_practice": return tasks.filter((t) => t.order?.status === "on_hold");
      case "scan_review": return tasks.filter((t) => t.task_type === "Scan Review");
      case "design_prep": return tasks.filter((t) => t.task_type === "Design Prep");
      case "design_review": return tasks.filter((t) => t.task_type === "Design Review");
      case "double_design_qc": return tasks.filter((t) => t.order?.double_qc);
      case "design_preview_verification": return tasks.filter((t) => t.task_type === "Design Preview Verification");
      case "order_review": return tasks.filter((t) => t.task_type === "Order Review");
      case "resolve_hold": return tasks.filter((t) => t.task_type === "Resolve Hold");
      case "resolve_flagged_scan": return tasks.filter((t) => t.task_type === "Resolve Flagged Scan");
      default: return tasks;
    }
  }, [tasks, activeCategory]);

  // Category counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.my_tasks = tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped").length;
    counts.completed = tasks.filter((t) => t.status === "completed" || t.status === "skipped").length;
    counts.assigned_others = tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "").length;
    counts.unassigned = tasks.filter((t) => !t.assigned_to).length;
    counts.waiting_practice = tasks.filter((t) => t.order?.status === "on_hold").length;
    counts.scan_review = tasks.filter((t) => t.task_type === "Scan Review").length;
    counts.design_prep = tasks.filter((t) => t.task_type === "Design Prep").length;
    counts.design_review = tasks.filter((t) => t.task_type === "Design Review").length;
    counts.double_design_qc = tasks.filter((t) => t.order?.double_qc).length;
    counts.design_preview_verification = tasks.filter((t) => t.task_type === "Design Preview Verification").length;
    counts.order_review = tasks.filter((t) => t.task_type === "Order Review").length;
    counts.resolve_hold = tasks.filter((t) => t.task_type === "Resolve Hold").length;
    counts.resolve_flagged_scan = tasks.filter((t) => t.task_type === "Resolve Flagged Scan").length;
    return counts;
  }, [tasks]);

  // Additional filters
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
    <div className="flex -m-4 md:-m-6 h-[calc(100vh-3.5rem)]">
      <TaskCategorySidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
      />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        <TaskFiltersBar
          taskTypeFilter={taskTypeFilter}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          labFilter={labFilter}
          localSearch={localSearch}
          onTaskTypeChange={setTaskTypeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onLabChange={setLabFilter}
          onLocalSearchChange={setLocalSearch}
          taskTypes={taskTypes}
          labs={labs}
        />

        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No tasks found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sortedTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
