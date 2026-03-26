import { useApp } from "@/context/AppContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskFiltersSidebar } from "@/components/TaskFiltersSidebar";
import { ClipboardList, Search, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AssignTaskModal } from "@/components/AssignTaskModal";
import { Task } from "@/types";

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
  const { tasks, assignTask } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my_tasks");
  const [assignModalTask, setAssignModalTask] = useState<Task | null>(null);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.my_tasks = tasks.filter((t) => t.assigned_to === "u1" && t.status !== "completed" && t.status !== "skipped").length;
    counts.completed = tasks.filter((t) => t.status === "completed" || t.status === "skipped").length;
    counts.assigned_others = tasks.filter((t) => t.assigned_to && t.assigned_to !== "u1" && t.assigned_to !== "").length;
    counts.unassigned = tasks.filter((t) => !t.assigned_to || t.assigned_to === "").length;
    counts.waiting_practice = tasks.filter((t) => t.order?.status === "on_hold").length;

    Object.entries(taskTypeMap).forEach(([key, typeValue]) => {
      counts[key] = tasks.filter((t) => t.task_type === typeValue).length;
    });

    return counts;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

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
        if (taskTypeMap[activeTab]) {
          filtered = tasks.filter((t) => t.task_type === taskTypeMap[activeTab]);
        }
        break;
    }

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

  const isUnassignedTab = activeTab === "unassigned";

  const groupedUnassigned = useMemo(() => {
    if (!isUnassignedTab) return null;
    const treatmentPlan = filteredTasks.filter((t) => t.task_group === "treatment_plan");
    const preparing = filteredTasks.filter((t) => t.task_group === "preparing");
    const other = filteredTasks.filter((t) => !t.task_group);
    return { treatmentPlan, preparing, other };
  }, [filteredTasks, isUnassignedTab]);

  const handleAssign = (taskId: string, data: { doctorId: string; estimatedTime: string; priority: string; notes: string }) => {
    assignTask(taskId, data.doctorId);
    setAssignModalTask(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center h-14 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 px-4 w-64 shrink-0 border-r h-full">
          <SidebarTrigger className="shrink-0" />
          <h2 className="text-sm font-semibold leading-tight flex-1">Tasks</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-50 hover:opacity-100">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center flex-1 px-5 gap-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Focusing On:</span>
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5">Design Anterior C&B Level 4</Badge>
          </div>
          <div className="flex-1" />
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-secondary border-0 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-0">
        <TaskFiltersSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabCounts={tabCounts}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ClipboardList className="h-10 w-10 mb-3 opacity-20" />
                <p className="font-medium text-sm">No tasks found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            ) : isUnassignedTab && groupedUnassigned ? (
              <div className="space-y-6">
                {groupedUnassigned.other.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {groupedUnassigned.other.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} showAssign onAssign={() => setAssignModalTask(task)} />
                    ))}
                  </div>
                )}
                {groupedUnassigned.treatmentPlan.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Treatment Plan Tasks</p>
                    <div className="flex flex-col gap-2.5">
                      {groupedUnassigned.treatmentPlan.map((task, i) => (
                        <TaskCard key={task.id} task={task} index={i} showAssign onAssign={() => setAssignModalTask(task)} />
                      ))}
                    </div>
                  </div>
                )}
                {groupedUnassigned.preparing.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Preparing Tasks</p>
                    <div className="flex flex-col gap-2.5">
                      {groupedUnassigned.preparing.map((task, i) => (
                        <TaskCard key={task.id} task={task} index={i} showAssign onAssign={() => setAssignModalTask(task)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {filteredTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignTaskModal
        open={!!assignModalTask}
        onClose={() => setAssignModalTask(null)}
        onSubmit={(data) => assignModalTask && handleAssign(assignModalTask.id, data)}
        taskType={assignModalTask?.task_type}
      />
    </div>
  );
}
