import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import {
  Calendar, Scissors, Tag, Building, MapPin,
  FlaskConical, Eye, Layers, Truck, Smartphone, ScanLine, Monitor, Copy } from
"lucide-react";
import { InfoRow } from "./InfoRow";
import { toast } from "sonner";

interface Props {
  order: Order;
  timeLeft: string;
  isOverdue: boolean;
  isUrgent: boolean;
}

export function UnifiedPatientCard({ order, timeLeft, isOverdue, isUrgent }: Props) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Patient Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg font-bold">{order.patient_name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
              {order.patient_age && <span>{order.patient_age}y</span>}
              {order.patient_gender && <span>• {order.patient_gender}</span>}
              <span className="inline-flex items-center gap-1">
                • {order.id}
                <button
                  onClick={() => { navigator.clipboard.writeText(order.id); toast.success("Order ID copied"); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </span>
              {order.is_split &&
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20 gap-0.5">
                  <Scissors className="h-2.5 w-2.5" /> Split
                </Badge>
              }
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">{order.case_type}</Badge>
            {order.crown_type && <Badge variant="outline" className="text-xs whitespace-nowrap">{order.crown_type}</Badge>}
            <PriorityBadge priority={order.priority} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}>
              Due: {timeLeft}
            </span>
          </div>
          {order.tags && order.tags.length > 0 &&
          <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {order.tags.map((tag) =>
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
            )}
            </div>
          }
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Doctor & Practice */}
      <div className="pt-3 pb-2 py-[8px] px-[20px]">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Doctor & Practice</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
          <InfoRow label="Doctor" value={order.doctor_name} />
          <InfoRow label="Practice" value={order.practice} />
          <InfoRow label="Address" value={order.address} />
          <InfoRow label="Country" value={order.country} />
        </div>
      </div>

      <div className="border-t border-border mx-4" />

      {/* Order Details */}
      <div className="pt-3 py-[11px] pb-[20px] px-[20px]">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
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
    </div>);

}