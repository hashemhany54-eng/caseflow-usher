import { Order } from "@/types";
import { Building, MapPin } from "lucide-react";
import { InfoRow } from "./InfoRow";

export function DoctorPracticeCard({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <h2 className="text-sm font-semibold mb-3">Doctor & Practice</h2>
      <div className="grid gap-2">
        <InfoRow label="Doctor" value={order.doctor_name} />
        <InfoRow label="Practice" value={order.practice} icon={Building} />
        <InfoRow label="Address" value={order.address} icon={MapPin} />
        <InfoRow label="Country" value={order.country} />
      </div>
    </div>
  );
}
