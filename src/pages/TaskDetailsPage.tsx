import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { mockTimeline } from "@/data/mockData";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

import { PatientSummaryCard } from "@/components/task-details/PatientSummaryCard";
import { DoctorPracticeCard } from "@/components/task-details/DoctorPracticeCard";
import { OrderDetailsCard } from "@/components/task-details/OrderDetailsCard";
import { DesignTimeline } from "@/components/task-details/DesignTimeline";
import { DesignReviewCard } from "@/components/task-details/DesignReviewCard";
import { FlagScanModal } from "@/components/task-details/FlagScanModal";
import { CaseNoteSummary } from "@/components/task-details/CaseNoteSummary";
import { SummaryAndItems } from "@/components/task-details/SummaryAndItems";
import { SplitOrdersSection } from "@/components/task-details/SplitOrdersSection";
import { BillingSection } from "@/components/task-details/BillingSection";
import { OrderScansSection } from "@/components/task-details/OrderScansSection";
import { ActivityPanel } from "@/components/task-details/ActivityPanel";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, completeTask, skipTask } = useApp();
  const task = tasks.find((t) => t.id === taskId);
  const [chatCollapsed, setChatCollapsed] = useState(false);

  if (!task || !task.order) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Task not found
      </div>
    );
  }

  const order = task.order;
  const { timeLeft, isOverdue, isUrgent } = useCountdown(task.due_date);
  const timeline = mockTimeline[order.id] || [];

  const handleReview = () => {
    completeTask(task.id);
    toast.success("Design review completed");
    navigate("/");
  };

  const handleSkip = () => {
    skipTask(task.id);
    toast.info("Task skipped");
    navigate("/");
  };

  return (
    <Tabs defaultValue="order" className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 md:-m-6">
      {/* Primary Tabs - Pinned at top */}
      <div className="border-b bg-background px-4 md:px-6 shrink-0 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <TabsList className="h-10 bg-transparent rounded-none justify-start gap-0 p-0">
          <TabsTrigger value="order" className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5">Order</TabsTrigger>
          <TabsTrigger value="scan" className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5">Scan</TabsTrigger>
          <TabsTrigger value="editor" className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5">Editor</TabsTrigger>
          <TabsTrigger value="design" className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5">Design</TabsTrigger>
        </TabsList>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">

            {/* Resubmitted Banner */}
            {order.is_resubmitted && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                  <RefreshCw className="h-4 w-4" />
                  This order was resubmitted
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs h-7">View Original Order</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader><SheetTitle>Original Order</SheetTitle></SheetHeader>
                    <div className="mt-4 space-y-3 text-sm">
                      <p className="text-muted-foreground">Order ID: {order.original_order_id}</p>
                      <p className="text-muted-foreground">This order was previously submitted and returned for revision.</p>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            {/* ORDER TAB */}
            <TabsContent value="order" className="mt-0 space-y-4">
              <PatientSummaryCard order={order} timeLeft={timeLeft} isOverdue={isOverdue} isUrgent={isUrgent} />
              <DoctorPracticeCard order={order} />
              <OrderDetailsCard order={order} />

              {/* Combined Timeline + Review Card with Secondary Tabs */}
              <div className="rounded-lg border bg-card">
                <Tabs defaultValue="tat">
                  <div className="flex items-center border-b">
                    <TabsList className="h-10 bg-transparent rounded-none justify-start gap-0 p-0 px-5 flex-1">
                      {["TAT", "Status", "Tickets", "Review", "Design", "Zendesk"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab.toLowerCase()}
                          className="text-sm h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-success data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground px-4 text-muted-foreground"
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
                    <DesignReviewCard onReview={handleReview} />
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
                  <TabsContent value="zendesk" className="p-5">
                    <div className="text-center text-muted-foreground text-sm py-6">Zendesk integration coming soon</div>
                  </TabsContent>
                </Tabs>
              </div>

              <CaseNoteSummary />
              <SummaryAndItems />
              <SplitOrdersSection />
              <BillingSection />
              <OrderScansSection />
            </TabsContent>

            <TabsContent value="scan" className="mt-0">
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground text-sm">Scan viewer coming soon</div>
            </TabsContent>
            <TabsContent value="editor" className="mt-0">
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground text-sm">3D Editor coming soon</div>
            </TabsContent>
            <TabsContent value="design" className="mt-0">
              <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground text-sm">Design workspace coming soon</div>
            </TabsContent>
          </div>
        </motion.div>

        {/* Right Activity Panel */}
        <ActivityPanel collapsed={chatCollapsed} onToggle={() => setChatCollapsed(!chatCollapsed)} />
      </div>
    </Tabs>
  );
}
