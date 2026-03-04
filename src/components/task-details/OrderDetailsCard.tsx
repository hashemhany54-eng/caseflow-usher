import { Order } from "@/types";
import { FlaskConical, Eye, Layers, Truck, Smartphone, ScanLine, Monitor } from "lucide-react";
import { InfoRow } from "./InfoRow";

export function OrderDetailsCard({ order }: { order: Order }) {
  return (
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
  );
}
