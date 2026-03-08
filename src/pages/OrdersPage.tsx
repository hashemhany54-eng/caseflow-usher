import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/useCountdown";
import { Package, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Order } from "@/types";
import { Input } from "@/components/ui/input";
import { mockTimeline } from "@/data/mockData";
import { OrderFiltersSidebar } from "@/components/OrderFiltersSidebar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
      className="flex flex-col md:flex-row md:items-stretch rounded-lg border bg-card hover:shadow-sm hover:border-primary/20 cursor-pointer transition-all min-h-[72px]"
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch flex-1 min-w-0">
        <div className="flex items-start px-4 py-3 sm:min-w-[140px] sm:w-[160px] md:w-[180px] shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-sm font-medium truncate">{order.patient_name}</p>
            {order.is_resubmitted && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/20 gap-0.5 shrink-0">
                <RefreshCw className="h-2.5 w-2.5" /> Resub
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-start px-4 py-3 sm:min-w-[120px] sm:w-[140px] md:w-[160px] shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
          <p className="text-sm truncate">{order.doctor_name || "—"}</p>
          <p className="text-xs text-muted-foreground truncate">{order.practice || "—"}</p>
        </div>

        <div className="flex flex-col justify-start px-4 py-3 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-border/50">
          <p className="text-sm truncate">{order.case_type}{order.crown_type ? ` - ${order.crown_type}` : ""}</p>
          <p className="text-xs text-muted-foreground truncate">{order.lab_type}</p>
        </div>
      </div>

      <div className="flex items-start px-4 py-3 md:max-w-[360px] lg:max-w-[450px] md:flex-1 shrink-0">
        <div className="flex w-full gap-2 sm:gap-3">
          {orderStages.map((stage) => {
            const done = completedStages.has(stage as any);
            const stageEvent = timeline.find((t) => t.stage === stage);
            return (
              <div key={stage} className="flex-1 flex flex-col gap-1">
                <div className={`h-[3px] w-full rounded-full ${done ? (hasOverdueStage ? "bg-destructive" : "bg-foreground") : "bg-muted"}`} />
                <span className="text-[10px] sm:text-[11px] font-medium text-foreground leading-tight">{orderStageLabels[stage]}</span>
                {stageEvent && <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-none">{formatDate(stageEvent.timestamp)}</span>}
              </div>
            );
          })}

          <div className="flex-1 flex flex-col gap-1">
            <div className="h-[3px] w-full rounded-full bg-muted" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-foreground leading-tight">Original ETA</span>
            <span className={`text-[9px] sm:text-[10px] font-semibold leading-none ${isOverdue ? "text-destructive" : isUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {formattedTime}
            </span>
            <span className="text-[9px] sm:text-[10px] text-primary leading-none">Practice Sees</span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-foreground leading-none">{practiceSees}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const { orders } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts.all = orders.length;
    // Review tabs
    counts.unsubmitted_scans = orders.filter((o) => o.status === "new").length;
    counts.needs_review = orders.filter((o) => o.status === "waiting_review").length;
    counts.design_preview_review = orders.filter((o) => o.status === "in_progress").length;
    counts.on_hold = orders.filter((o) => o.status === "on_hold").length;
    // Status tabs
    counts.new = orders.filter((o) => o.status === "new").length;
    counts.fabrication = orders.filter((o) => o.status === "in_progress").length;
    counts.shipped = orders.filter((o) => o.status === "shipped").length;
    counts.delivered = orders.filter((o) => o.status === "delivered").length;
    counts.canceled = orders.filter((o) => o.status === "canceled").length;
    return counts;
  }, [orders]);

  const statusMap: Record<string, string> = {
    unsubmitted_scans: "new",
    needs_review: "waiting_review",
    design_preview_review: "in_progress",
    on_hold: "on_hold",
    new: "new",
    fabrication: "in_progress",
    shipped: "shipped",
    delivered: "delivered",
    canceled: "canceled",
  };

  const filtered = useMemo(() => {
    let result = orders;

    if (activeTab !== "all" && statusMap[activeTab]) {
      result = result.filter((o) => o.status === statusMap[activeTab]);
    }

    const q = searchQuery.toLowerCase();
    if (q) {
      result = result.filter(
        (o) => o.patient_name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  const grouped = useMemo(() => {
    return statusGroups
      .map((group) => ({
        ...group,
        orders: filtered.filter((o) => o.status === group.key),
      }))
      .filter((g) => g.orders.length > 0);
  }, [filtered]);

  return (
    <div className="flex flex-col h-full">
      {/* Unified top bar */}
      <div className="flex items-center h-14 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 px-3 w-64 shrink-0 border-r h-full">
          <SidebarTrigger className="shrink-0" />
          <h2 className="text-sm font-semibold leading-tight flex-1">Orders</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center flex-1 px-4 gap-4">
          <div className="flex-1" />
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 bg-secondary border-0 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 min-h-0">
        <OrderFiltersSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabCounts={tabCounts}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-3 md:p-4">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">No orders found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {grouped.map((group) => (
                  <div key={group.key}>
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
        </div>
      </div>
    </div>
  );
}
