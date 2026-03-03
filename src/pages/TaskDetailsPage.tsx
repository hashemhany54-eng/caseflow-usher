import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, RefreshCw, Calendar, CheckCircle2, SkipForward, Building, MapPin, Smartphone, ScanLine, Scissors, Monitor, Truck, FlaskConical, Layers, Eye, Tag } from "lucide-react";
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

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value?: string | boolean | null; icon?: any }) => {
    if (value === undefined || value === null || value === "") return null;
    const display = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
    return (
      <div className="flex items-center gap-2 text-sm">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{display}</span>
      </div>
    );
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

      {/* Patient & Order Header */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">{order.patient_name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
              {order.patient_age && <span>{order.patient_age}y</span>}
              {order.patient_gender && <span>• {order.patient_gender}</span>}
              <span>• {order.id}</span>
              {order.is_split && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20 gap-0.5">
                  <Scissors className="h-2.5 w-2.5" /> Split
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{order.case_type}</Badge>
            {order.crown_type && <Badge variant="outline" className="text-xs">{order.crown_type}</Badge>}
            <PriorityBadge priority={order.priority} />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}>
            Due: {timeLeft}
          </span>
        </div>
        {/* Tags */}
        {order.tags && order.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {order.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Doctor & Practice */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-3">Doctor & Practice</h2>
        <div className="grid gap-2">
          <InfoRow label="Doctor" value={order.doctor_name} />
          <InfoRow label="Practice" value={order.practice} icon={Building} />
          <InfoRow label="Address" value={order.address} icon={MapPin} />
          <InfoRow label="Country" value={order.country} />
        </div>
      </div>

      {/* Order Metadata */}
      <div className="rounded-lg border bg-card p-5 mb-4">
        <h2 className="text-sm font-semibold mb-3">Order Details</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <InfoRow label="Production Order" value={order.production_order} />
          <InfoRow label="Lab" value={order.lab_type} icon={FlaskConical} />
          <InfoRow label="Design Preview" value={order.design_preview} icon={Eye} />
          <InfoRow label="Designer" value={order.designer_name} />
          <InfoRow label="Prep" value={order.prep} />
          <InfoRow label="Separate Model" value={order.separate_model} />
          <InfoRow label="QC Required" value={order.qc_required} />
          <InfoRow label="Double QC" value={order.double_qc} />
          <InfoRow label="Design Level" value={order.design_level} icon={Layers} />
          <InfoRow label="Shipping" value={order.shipping_type} icon={Truck} />
          <InfoRow label="App Source" value={order.app_source} icon={Smartphone} />
          <InfoRow label="Scanner" value={order.scanner} icon={ScanLine} />
          <InfoRow label="Laptop" value={order.laptop} icon={Monitor} />
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
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer hover:ring-2 hover:ring-primary/30 ${
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

      {/* Additional Info Accordion */}
      <Accordion type="single" collapsible className="rounded-lg border bg-card mb-4">
        <AccordionItem value="info" className="border-0">
          <AccordionTrigger className="px-5 text-sm font-semibold hover:no-underline">
            Additional Information
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4">
            <div className="grid gap-2 text-sm">
              <InfoRow label="Crown Type" value={order.crown_type} />
              <InfoRow label="Case Type" value={order.case_type} />
              <InfoRow label="Split Case" value={order.is_split} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
