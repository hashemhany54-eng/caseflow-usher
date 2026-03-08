import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersSidebar } from "@/components/TaskFiltersSidebar";
import { useOutletContext } from "react-router-dom";
import { ClipboardList, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="flex h-full">
      <TaskFiltersSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabCounts={tabCounts}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center h-14 border-b bg-card shrink-0 px-4 gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Focusing On:</span>
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">Design Anterior C&B Level 4</Badge>
          </div>
          <div className="flex-1" />
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by task"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-8 bg-secondary border-0 text-sm"
            />
          </div>
        </div>
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
    </div>
  );
}
