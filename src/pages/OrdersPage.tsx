import { useApp } from "@/context/AppContext";
import { useOutletContext } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { useCountdown } from "@/hooks/useCountdown";
import { Package, Clock, RefreshCw, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Order } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockTimeline } from "@/data/mockData";

const statusGroups = [
  { key: "new", label: "New", color: "bg-primary/10 text-primary" },
  { key: "in_progress", label: "In Progress", color: "bg-primary/10 text-primary" },
  { key: "waiting_review", label: "Waiting for Review", color: "bg-warning/10 text-warning" },
  { key: "on_hold", label: "On Hold", color: "bg-muted text-muted-foreground" },
  { key: "completed", label: "Completed", color: "bg-success/10 text-success" },
  { key: "shipped", label: "Shipped", color: "bg-success/10 text-success" },
  { key: "delivered", label: "Delivered", color: "bg-success/10 text-success" },
  { key: "canceled", label: "Canceled", color: "bg-destructive/10 text-destructive" },
];

const orderStages = ["order_placed", "design", "preview"] as const;
const orderStageLabels: Record<string, string> = {
  order_placed: "Placed",
  design: "Fabrication",
  preview: "Shipped",
};

function OrderRow({ order, index }: { order: Order; index: number }) {
  const navigate = useNavigate();
  const { timeLeft, isOverdue, isUrgent } = useCountdown(order.due_date);

  const dueDate = new Date(order.due_date);
  const formattedDue = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const formattedTime = dueDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const timeline = mockTimeline[order.id] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const hasOverdueStage = isOverdue;

  // Practice sees: simple relative label
  const now = Date.now();
  const dueTime = dueDate.getTime();
  const diffDays = Math.round((dueTime - now) / 86400000);
  const practiceSees = diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : diffDays < 0 ? `${Math.abs(diffDays)}d ago` : formattedDue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className="flex items-stretch rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 cursor-pointer transition-all"
    >
      {/* Patient Name */}
      <div className="flex items-center min-w-[160px] w-[180px] shrink-0 px-3 py-2 border-r border-border/50">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{order.patient_name}</p>
          {order.is_resubmitted && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/20 gap-0.5 shrink-0">
              <RefreshCw className="h-2.5 w-2.5" /> Resub
            </Badge>
          )}
        </div>
      </div>

      {/* Doctor & Practice */}
      <div className="flex flex-col justify-center min-w-[140px] w-[160px] shrink-0 px-3 py-2 border-r border-border/50">
        <p className="text-sm truncate">{order.doctor_name || "—"}</p>
        <p className="text-xs text-muted-foreground truncate">{order.practice || "—"}</p>
      </div>

      {/* Case Type & Lab */}
      <div className="flex flex-col justify-center min-w-[160px] flex-1 px-3 py-2 border-r border-border/50">
        <p className="text-sm truncate">{order.case_type}{order.crown_type ? ` - ${order.crown_type}` : ""}</p>
        <p className="text-xs text-muted-foreground truncate">{order.lab_type}</p>
      </div>

      {/* Timeline Stepper: Placed, Fabrication, Shipped + Original ETA */}
      <div className="flex items-center px-3 py-2 min-w-[420px] flex-[1.5]">
        <div className="flex w-full gap-3">
          {orderStages.map((stage) => {
            const done = completedStages.has(stage as any);
            const stageEvent = timeline.find((t) => t.stage === stage);
            return (
              <div key={stage} className="flex-1 flex flex-col gap-1">
                <div
                  className={`h-[3px] w-full rounded-full ${
                    done
                      ? hasOverdueStage ? "bg-destructive" : "bg-foreground"
                      : "bg-muted"
                  }`}
                />
                <span className="text-[11px] font-medium text-foreground leading-tight">
                  {orderStageLabels[stage]}
                </span>
                {stageEvent && (
                  <span className="text-[10px] text-muted-foreground leading-none">
                    {formatDate(stageEvent.timestamp)}
                  </span>
                )}
              </div>
            );
          })}

          {/* Original ETA as last step - part of the stepper */}
          <div className="flex-1 flex flex-col gap-1">
            <div className={`h-[3px] w-full rounded-full bg-muted`} />
            <span className="text-[11px] font-semibold text-foreground leading-tight">Original ETA</span>
            <span className={`text-[10px] font-semibold leading-none ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {formattedTime}
            </span>
            <span className="text-[10px] text-primary leading-none">Practice Sees</span>
            <span className="text-[10px] font-semibold text-foreground leading-none">{practiceSees}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default function OrdersPage() {
  const { orders } = useApp();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [labFilter, setLabFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [resubFilter, setResubFilter] = useState<string>("all");
  const [localSearch, setLocalSearch] = useState("");

  const labs = useMemo(() => [...new Set(orders.map((o) => o.lab_type))], [orders]);

  const filtered = useMemo(() => {
    let result = orders;
    const q = (searchQuery || localSearch).toLowerCase();
    if (q) {
      result = result.filter(
        (o) => o.patient_name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    if (labFilter !== "all") result = result.filter((o) => o.lab_type === labFilter);
    if (priorityFilter !== "all") result = result.filter((o) => o.priority === priorityFilter);
    if (resubFilter === "yes") result = result.filter((o) => o.is_resubmitted);
    if (resubFilter === "no") result = result.filter((o) => !o.is_resubmitted);
    return result;
  }, [orders, searchQuery, localSearch, statusFilter, labFilter, priorityFilter, resubFilter]);

  const grouped = useMemo(() => {
    return statusGroups.map((group) => ({
      ...group,
      orders: filtered.filter((o) => o.status === group.key),
    })).filter((g) => g.orders.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patient, order ID..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary border-0"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusGroups.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={labFilter} onValueChange={setLabFilter}>
          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Lab" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labs</SelectItem>
            {labs.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resubFilter} onValueChange={setResubFilter}>
          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Resubmitted" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Resubmitted</SelectItem>
            <SelectItem value="no">Not Resubmitted</SelectItem>
          </SelectContent>
        </Select>
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
