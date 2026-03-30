import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown, ChevronUp, Scissors, Tag } from "lucide-react";
import { InfoRow } from "./InfoRow";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  order: Order;
  timeLeft: string;
  isOverdue: boolean;
  isUrgent: boolean;
}

export function UnifiedPatientCard({ order }: Props) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Row 1: Doctor + Practice + Case type */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm font-medium">{order.doctor_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.practice}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{order.case_type}</Badge>
            {order.crown_type && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{order.crown_type}</Badge>}
            <PriorityBadge priority={order.priority} />
          </div>
        </div>
      </div>

      {/* Row 2: Collapsed tertiary info - ID, age, gender, tags */}
      <div className="border-t border-border">
        <button
          onClick={() => setDetailsExpanded(!detailsExpanded)}
          className="flex items-center justify-between w-full px-6 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[11px] flex items-center gap-1">
              {order.id}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-40 hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(order.id); toast.success("Copied"); }}
              >
                <Copy className="h-2.5 w-2.5" />
              </Button>
            </span>
            {order.patient_age && <span className="text-muted-foreground/60">{order.patient_age}y</span>}
            {order.patient_gender && <span className="text-muted-foreground/60">{order.patient_gender}</span>}
            {order.is_split && (
              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-warning/10 text-warning border-warning/20 gap-0.5">
                <Scissors className="h-2.5 w-2.5" /> Split
              </Badge>
            )}
            {order.tags && order.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-2.5 w-2.5 text-muted-foreground/50" />
                {order.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0 bg-secondary/60">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
          {detailsExpanded ? <ChevronUp className="h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" />}
        </button>

        {detailsExpanded && (
          <div className="px-6 pb-5 space-y-5 animate-in slide-in-from-top-1 duration-200">
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
