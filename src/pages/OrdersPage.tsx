import { useApp } from "@/context/AppContext";
import { useOutletContext } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useCountdown } from "@/hooks/useCountdown";
import { Package, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Order } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusGroups = [
  { key: "in_progress", label: "In Progress", color: "bg-primary/10 text-primary" },
  { key: "waiting_review", label: "Waiting for Review", color: "bg-warning/10 text-warning" },
  { key: "completed", label: "Completed", color: "bg-success/10 text-success" },
  { key: "canceled", label: "Canceled", color: "bg-muted text-muted-foreground" },
];

function OrderRow({ order, index }: { order: Order; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(order.due_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{order.patient_name}</p>
          <p className="text-xs text-muted-foreground">{order.case_type} • {order.lab_type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className={`h-3 w-3 ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : ""}`} />
          <span className={isOverdue ? "text-destructive" : isUrgent ? "text-warning" : ""}>{timeLeft}</span>
        </div>
        <PriorityBadge priority={order.priority} />
        <span className="text-xs text-muted-foreground">{order.id}</span>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const { orders } = useApp();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [labFilter, setLabFilter] = useState<string>("all");

  const labs = useMemo(() => [...new Set(orders.map((o) => o.lab_type))], [orders]);

  const filtered = useMemo(() => {
    let result = orders;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) => o.patient_name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    if (labFilter !== "all") result = result.filter((o) => o.lab_type === labFilter);
    return result;
  }, [orders, searchQuery, statusFilter, labFilter]);

  const grouped = useMemo(() => {
    return statusGroups.map((group) => ({
      ...group,
      orders: filtered.filter((o) => o.status === group.key),
    })).filter((g) => g.orders.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} orders</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusGroups.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={labFilter} onValueChange={setLabFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Lab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Labs</SelectItem>
              {labs.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Package className="h-12 w-12 mb-3 opacity-30" />
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className={`text-xs ${group.color}`}>{group.label}</Badge>
                <span className="text-xs text-muted-foreground">{group.orders.length}</span>
              </div>
              <div className="space-y-2">
                {group.orders.map((order, i) => (
                  <OrderRow key={order.id} order={order} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
