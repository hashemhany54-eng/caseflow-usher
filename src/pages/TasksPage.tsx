import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersSidebar } from "@/components/TaskFiltersSidebar";
import { useOutletContext } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

// Map sidebar tab keys to task_type values
const taskTypeMap: Record<string, string> = {
  design_prep: "Design Prep",
  automate_review: "Automate Review",
  dandy_design: "Dandy Design",
  design_review: "Design Review",
  double_design_qc: "Double Design QC",
  design_preview_verification: "Design Preview Verification",
  shade_design: "Shade Design",
  resolve_hold: "Resolve Hold",
  resolve_flagged_scan: "Resolve Flagged Scan",
  scan_review: "Scan Review",
  order_review: "Order Review",
};

export default function TasksPage() {
  const { tasks } = useApp();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [activeTab, setActiveTab] = useState("my_tasks");

  // Compute counts for each tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.my_tasks = tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped").length;
    counts.completed = tasks.filter((t) => t.status === "completed" || t.status === "skipped").length;
    counts.assigned_others = tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "").length;
    counts.unassigned = tasks.filter((t) => !t.assigned_to || t.assigned_to === "").length;
    counts.waiting_practice = tasks.filter((t) => t.order?.status === "on_hold").length;

    // Task type counts
    Object.entries(taskTypeMap).forEach(([key, typeValue]) => {
      counts[key] = tasks.filter((t) => t.task_type === typeValue).length;
    });

    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Category filters
    switch (activeTab) {
      case "my_tasks":
        filtered = tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped");
        break;
      case "completed":
        filtered = tasks.filter((t) => t.status === "completed" || t.status === "skipped");
        break;
      case "assigned_others":
        filtered = tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "");
        break;
      case "unassigned":
        filtered = tasks.filter((t) => !t.assigned_to || t.assigned_to === "");
        break;
      case "waiting_practice":
        filtered = tasks.filter((t) => t.order?.status === "on_hold");
        break;
      default:
        // Task type filter
        if (taskTypeMap[activeTab]) {
          filtered = tasks.filter((t) => t.task_type === taskTypeMap[activeTab]);
        }
        break;
    }

    // Search
    const q = (searchQuery || "").toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (t) =>
          t.order?.patient_name.toLowerCase().includes(q) ||
          t.order?.case_type.toLowerCase().includes(q) ||
          t.order_id.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      const now = Date.now();
      return new Date(a.due_date).getTime() - now - (new Date(b.due_date).getTime() - now);
    });
  }, [tasks, activeTab, searchQuery]);

  return (
    <div className="flex h-full -m-3 md:-m-4">
      <TaskFiltersSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
      />

      <div className="flex-1 overflow-auto p-3 md:p-4">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ClipboardList className="h-10 w-10 mb-2 opacity-30" />
            <p className="font-medium text-sm">No tasks found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
