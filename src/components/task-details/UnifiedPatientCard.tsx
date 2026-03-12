import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Calendar, Scissors, Tag, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { InfoRow } from "./InfoRow";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  order: Order;
  timeLeft: string;
  isOverdue: boolean;
  isUrgent: boolean;
}

export function UnifiedPatientCard({ order, timeLeft, isOverdue, isUrgent }: Props) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Patient Header - always visible */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-xl font-bold font-display">{order.patient_name}</h1>
            <div className="flex items-center gap-2.5 mt-1.5 text-sm text-muted-foreground flex-wrap">
              {order.patient_age && <span>{order.patient_age}y</span>}
              {order.patient_gender && <span>· {order.patient_gender}</span>}
              <span className="inline-flex items-center gap-1 font-mono text-xs">
                · {order.id}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-40 hover:opacity-100"
                  onClick={() => { navigator.clipboard.writeText(order.id); toast.success("Copied"); }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </span>
              {order.is_split && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20 gap-0.5">
                  <Scissors className="h-2.5 w-2.5" /> Split
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">{order.case_type}</Badge>
            {order.crown_type && <Badge variant="outline" className="text-xs whitespace-nowrap">{order.crown_type}</Badge>}
            <PriorityBadge priority={order.priority} />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}>
              {timeLeft}
            </span>
          </div>
          {order.tags && order.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {order.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progressive disclosure: Doctor & Order Details */}
      <div className="border-t border-border">
        <button
          onClick={() => setDetailsExpanded(!detailsExpanded)}
          className="flex items-center justify-between w-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <span className="uppercase tracking-wider">
            {order.doctor_name} · {order.practice}
          </span>
          {detailsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {detailsExpanded && (
          <div className="px-6 pb-5 space-y-5 animate-in slide-in-from-top-1 duration-200">
            {/* Doctor & Practice */}
            <div>
              <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Doctor & Practice</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5">
                <InfoRow label="Doctor" value={order.doctor_name} />
                <InfoRow label="Practice" value={order.practice} />
                <InfoRow label="Address" value={order.address} />
                <InfoRow label="Country" value={order.country} />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Order Details */}
            <div>
              <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Order Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5">
                <InfoRow label="Production" value={order.production_order} />
                <InfoRow label="Lab" value={order.lab_type} />
                <InfoRow label="Preview" value={order.design_preview} />
                <InfoRow label="Designer" value={order.designer_name} />
                <InfoRow label="Prep" value={order.prep} />
                <InfoRow label="Sep. Model" value={order.separate_model} />
                <InfoRow label="QC" value={order.qc_required} />
                <InfoRow label="Double QC" value={order.double_qc} />
                <InfoRow label="Level" value={order.design_level} />
                <InfoRow label="Shipping" value={order.shipping_type} />
                <InfoRow label="Source" value={order.app_source} />
                <InfoRow label="Scanner" value={order.scanner} />
                <InfoRow label="Laptop" value={order.laptop} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
