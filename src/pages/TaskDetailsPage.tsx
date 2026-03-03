import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, RefreshCw, Calendar, User, CheckCircle2, SkipForward, Building, MapPin, Smartphone, ScanLine } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { mockTimeline } from "@/data/mockData";
import { motion } from "framer-motion";
import { toast } from "sonner";

const stageLabels: Record<string, string> = {
  order_placed: "Order Placed",
  design: "Design",
  qc: "QC",
  preview: "Preview",
  model: "Model",
};
const stages = ["order_placed", "design", "qc", "preview", "model"];

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, completeTask, skipTask } = useApp();
  const task = tasks.find((t) => t.id === taskId);

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
  const completedStages = new Set(timeline.map((t) => t.stage));

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Resubmitted Banner */}
      {order.is_resubmitted && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-destructive text-sm font-medium">
            <RefreshCw className="h-4 w-4" />
            This order was resubmitted
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-7">
                View Original Order
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Original Order</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-muted-foreground">Order ID: {order.original_order_id}</p>
                <p className="text-muted-foreground">This order was previously submitted and returned for revision.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Header */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">{order.patient_name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              {order.patient_age && <span>{order.patient_age}y</span>}
              {order.patient_gender && <span>• {order.patient_gender}</span>}
              <span>• {order.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{order.case_type}</Badge>
            <PriorityBadge priority={order.priority} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}>
            Due: {timeLeft}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-4">Design Timeline</h2>
        <div className="flex items-center justify-between">
          {stages.map((stage, i) => {
            const done = completedStages.has(stage as any);
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="text-[10px] mt-1 text-muted-foreground">{stageLabels[stage]}</span>
                </div>
                {i < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-success" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-3">Design Review</h2>
        <div className="flex gap-3">
          <Button onClick={handleReview} className="flex-1 gap-2">
            <CheckCircle2 className="h-4 w-4" /> Review Design
          </Button>
          <Button onClick={handleSkip} variant="outline" className="gap-2">
            <SkipForward className="h-4 w-4" /> Skip Review
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <Accordion type="single" collapsible className="rounded-lg border bg-card">
        <AccordionItem value="info" className="border-0">
          <AccordionTrigger className="px-5 text-sm font-semibold hover:no-underline">
            Additional Information
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4">
            <div className="grid gap-3 text-sm">
              {order.practice && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-3.5 w-3.5" /> {order.practice}
                </div>
              )}
              {order.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {order.address}
                </div>
              )}
              {order.scanner && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ScanLine className="h-3.5 w-3.5" /> {order.scanner}
                </div>
              )}
              {order.app_source && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" /> {order.app_source}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
