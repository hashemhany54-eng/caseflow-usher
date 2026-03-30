import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, UserPlus, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/useCountdown";
import { mockTimeline } from "@/data/mockData";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { AssignTaskModal } from "@/components/AssignTaskModal";

import { UnifiedPatientCard } from "@/components/task-details/UnifiedPatientCard";
import { TaskListSidebar } from "@/components/task-details/TaskListSidebar";
import { DesignTimeline } from "@/components/task-details/DesignTimeline";
import { DesignReviewCard } from "@/components/task-details/DesignReviewCard";
import { FlagScanModal } from "@/components/task-details/FlagScanModal";
import { CaseNoteSummary } from "@/components/task-details/CaseNoteSummary";
import { SummaryAndItems } from "@/components/task-details/SummaryAndItems";
import { SplitOrdersSection } from "@/components/task-details/SplitOrdersSection";
import { BillingSection } from "@/components/task-details/BillingSection";
import { OrderScansSection } from "@/components/task-details/OrderScansSection";
import { ActivityPanel } from "@/components/task-details/ActivityPanel";
import { DesignWorkspace } from "@/components/task-details/DesignWorkspace";
import { OrderTasksPanel } from "@/components/task-details/OrderTasksPanel";
import { UploadDrawer } from "@/components/UploadDrawer";

interface OutletCtx {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TaskDetailsPage() {
  const { taskId, orderId } = useParams();
  const navigate = useNavigate();
  const { tasks, orders, completeTask, skipTask, assignTask } = useApp();
  const { activeTab, setActiveTab } = useOutletContext<OutletCtx>();
  const [chatCollapsed, setChatCollapsed] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [qcOpen, setQcOpen] = useState(false);

  const task = taskId
    ? tasks.find((t) => t.id === taskId)
    : orderId
    ? tasks.find((t) => t.order_id === orderId)
    : undefined;

  const isTreatmentPlan = task?.task_type === "Treatment Plan";
  const isUnassigned = !!task && !task.assigned_to && !!task.task_group;
  const isReview = task?.task_type === "Design Review";

  const order = task?.order || (orderId ? orders.find((o) => o.id === orderId) : undefined);

  const { timeLeft, isOverdue, isUrgent } = useCountdown(order?.due_date || "");
  const timeline = mockTimeline[order?.id || ""] || [];

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Order not found
      </div>
    );
  }

  const handleReview = () => {
    if (task) completeTask(task.id);
    toast.success("Design review completed");
    navigate(orderId ? "/orders" : "/");
  };

  const handleSkip = () => {
    if (task) skipTask(task.id);
    toast.info("Task skipped");
    navigate(orderId ? "/orders" : "/");
  };

  const [qcOpen, setQcOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left: Tasks list panel */}
      {activeTab !== "design" && (
        <OrderTasksPanel currentTaskId={task?.id} className="hidden lg:flex" />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Action Bar - Level 1 Priority */}
        {activeTab === "order" && (
          <div className="shrink-0 border-b bg-card px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold font-display truncate">{order.patient_name}</h1>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 shrink-0 ${
                      isOverdue
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : isUrgent
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {timeLeft}
                  </Badge>
                  {order.qc_required && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">QC</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {task?.task_type || "Design Review"} · {order.doctor_name} · {order.practice}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <FlagScanModal />
              {!isUnassigned && (
                <Button
                  onClick={() => isReview ? setQcOpen(true) : setUploadOpen(true)}
                  className="gap-2 shadow-sm"
                >
                  {isReview ? (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Start Review
                    </>
                  ) : isTreatmentPlan ? (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Plan
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Design
                    </>
                  )}
                </Button>
              )}
              {isUnassigned && (
                <Button onClick={() => setAssignOpen(true)} className="gap-2 shadow-sm">
                  <UserPlus className="h-4 w-4" />
                  Assign
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {activeTab === "design" ? (
            <DesignWorkspace />
          ) : (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-auto p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                  {/* Resubmitted Banner - more prominent */}
                  {order.is_resubmitted && (
                    <Alert variant="destructive" className="flex items-center justify-between py-3 px-4 mb-4 border-destructive/30 bg-destructive/5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                        <AlertTitle className="mb-0 text-sm font-semibold">This order was resubmitted — review changes carefully</AlertTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 shrink-0 ml-4 border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => navigate(`/orders/${order.original_order_id}/original`)}
                      >
                        View Changes
                      </Button>
                    </Alert>
                  )}

                  {activeTab === "order" && (
                    <div className="space-y-4">
                      {/* Timeline - Level 2: Workflow visibility */}
                      <div className="rounded-lg border bg-card p-5">
                        <DesignTimeline timeline={timeline} />
                      </div>

                      {/* Patient & Order Details - Level 3 */}
                      <UnifiedPatientCard order={order} timeLeft={timeLeft} isOverdue={isOverdue} isUrgent={isUrgent} />

                      {/* Case Notes - Level 4 */}
                      <CaseNoteSummary />

                      {/* Summary & Items - Level 4 */}
                      <SummaryAndItems />

                      {/* Lower priority sections - Level 5 */}
                      <SplitOrdersSection />
                      <BillingSection />
                      <OrderScansSection />
                    </div>
                  )}

                  {activeTab === "scan" && (
                    <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground text-sm">Scan viewer coming soon</div>
                  )}
                  {activeTab === "editor" && (
                    <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground text-sm">3D Editor coming soon</div>
                  )}
                </div>
              </motion.div>

              <ActivityPanel collapsed={chatCollapsed} onToggle={() => setChatCollapsed(!chatCollapsed)} />
            </>
          )}
        </div>
      </div>

      {isTreatmentPlan && (
        <UploadDrawer open={uploadOpen} onOpenChange={setUploadOpen} title="Upload Design / Upload Plan" />
      )}

      {/* QC Modal for reviews triggered from action bar */}
      {isReview && (
        <DesignReviewCard
          onReview={handleReview}
          taskType={task?.task_type || "Design Review"}
          patientName={order.patient_name}
          isUnassigned={isUnassigned}
          externalQcOpen={qcOpen}
          onExternalQcChange={setQcOpen}
        />
      )}

      {isUnassigned && task && (
        <AssignTaskModal
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          onSubmit={(data) => {
            assignTask(task.id, data.doctorId);
            toast.success("Task assigned successfully");
            setAssignOpen(false);
            navigate("/");
          }}
          taskType={task.task_type}
        />
      )}
    </div>
  );
}
