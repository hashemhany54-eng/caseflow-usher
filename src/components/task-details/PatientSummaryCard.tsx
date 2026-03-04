import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Calendar, Scissors, Tag } from "lucide-react";

interface Props {
  order: Order;
  timeLeft: string;
  isOverdue: boolean;
  isUrgent: boolean;
}

export function PatientSummaryCard({ order, timeLeft, isOverdue, isUrgent }: Props) {
  return (
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
      {order.tags && order.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {order.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
