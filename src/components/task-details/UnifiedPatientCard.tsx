import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import {
  Calendar, Scissors, Tag, Building, MapPin,
  FlaskConical, Eye, Layers, Truck, Smartphone, ScanLine, Monitor
} from "lucide-react";
import { InfoRow } from "./InfoRow";

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
        <div className="flex items-start justify-between mb-2">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={isOverdue ? "text-destructive font-medium" : isUrgent ? "text-warning font-medium" : "text-muted-foreground"}>
              Due: {timeLeft}
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

      <div className="border-t border-border" />

      {/* Doctor & Practice + Order Details side by side */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Doctor & Practice */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Doctor & Practice</h2>
          <div className="grid gap-2">
            <InfoRow label="Doctor" value={order.doctor_name} />
            <InfoRow label="Practice" value={order.practice} icon={Building} />
            <InfoRow label="Address" value={order.address} icon={MapPin} />
            <InfoRow label="Country" value={order.country} />
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 min-w-0">
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
      </div>
    </div>
  );
}
