import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { mockTimeline } from "@/data/mockData";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

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

interface OutletCtx {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TaskDetailsPage() {
  const { taskId, orderId } = useParams();
  const navigate = useNavigate();
  const { tasks, orders, completeTask, skipTask } = useApp();
  const { activeTab, setActiveTab } = useOutletContext<OutletCtx>();
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // Find task by taskId or by orderId
  const task = taskId
    ? tasks.find((t) => t.id === taskId)
    : orderId
    ? tasks.find((t) => t.order_id === orderId)
    : undefined;

  // If no task found but we have an orderId, find the order directly
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

  return (
    <div className="flex h-full">
      {/* Left: Tasks list panel */}
      {activeTab !== "design" && (
        <OrderTasksPanel currentTaskId={task?.id} className="hidden lg:flex" />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-1 overflow-hidden">
          {activeTab === "design" ? (
            <DesignWorkspace />
          ) : (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-auto p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                  {/* Resubmitted Banner */}
                  {order.is_resubmitted && (
                    <Alert variant="destructive" className="flex items-center justify-between py-2.5 px-4 mb-4">
                      <div className="flex items-center">
                        <AlertTitle className="mb-0 text-sm font-medium">This order was resubmitted</AlertTitle>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs h-7 shrink-0 ml-4 bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 shadow-none"
                        onClick={() => navigate(`/orders/${order.original_order_id}/original`)}
                      >
                        View Original Order
                      </Button>
                    </Alert>
                  )}

                  {activeTab === "order" && (
                    <div className="space-y-4">
                      <UnifiedPatientCard order={order} timeLeft={timeLeft} isOverdue={isOverdue} isUrgent={isUrgent} />
                      <div className="rounded-lg border bg-card">
                        <Tabs defaultValue="tat">
                          <div className="flex items-center border-b overflow-x-auto">
                            <TabsList className="h-10 bg-transparent rounded-none justify-start gap-0 p-0 px-5 flex-1 min-w-0">
                              {["TAT", "Status", "Tickets", "Review", "Design"].map((tab) => (
                                <TabsTrigger
                                  key={tab}
                                  value={tab.toLowerCase()}
                                  className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground px-4 text-muted-foreground"
                                >
                                  {tab}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            <div className="pr-5 shrink-0">
                              <FlagScanModal />
                            </div>
                          </div>
                          <TabsContent value="tat" className="p-5 space-y-6">
                            <DesignTimeline timeline={timeline} />
                            <div className="border-t border-border" />
                            <DesignReviewCard onReview={handleReview} taskType={task?.task_type || "Design Review"} patientName={order.patient_name} />
                          </TabsContent>
                          <TabsContent value="status" className="p-5">
                            <div className="text-center text-muted-foreground text-sm py-6">Status tracking view coming soon</div>
                          </TabsContent>
                          <TabsContent value="review" className="p-5">
                            <div className="text-center text-muted-foreground text-sm py-6">Review history coming soon</div>
                          </TabsContent>
                          <TabsContent value="design" className="p-5">
                            <div className="text-center text-muted-foreground text-sm py-6">Design iterations coming soon</div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <CaseNoteSummary />
                      <SummaryAndItems />
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
    </div>
  );
}
