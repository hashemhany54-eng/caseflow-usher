import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { useCountdown } from "@/hooks/useCountdown";
import { Package, RefreshCw, Search, Pencil } from "lucide-react";
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
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "waiting_review", label: "Waiting for Review" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
];

const allStages = [
  { key: "order_placed", label: "Placed" },
  { key: "design", label: "Fabrication" },
  { key: "preview", label: "Shipment" },
  { key: "delivery", label: "Est. Delivery" },
] as const;

function OrderRow({ order, index }: { order: Order; index: number }) {
  const navigate = useNavigate();
  const { isOverdue, isUrgent } = useCountdown(order.due_date);

  const dueDate = new Date(order.due_date);
  const formattedDue = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const timeline = mockTimeline[order.id] || [];
  const completedStages = new Set(timeline.map((t) => t.stage));

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const actionLabel = order.status === "shipped" || order.status === "delivered"
    ? "View design"
    : order.status === "waiting_review"
    ? "Review"
    : "Modify RX";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className="group border-b border-border last:border-b-0 px-4 py-4 hover:bg-secondary/40 cursor-pointer transition-colors"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold leading-snug truncate">
            {order.patient_name}'s {order.case_type}{order.crown_type ? ` ${order.crown_type}` : ""}
          </h3>
          {order.is_resubmitted && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/20 gap-0.5 shrink-0">
              <RefreshCw className="h-2.5 w-2.5" /> Resub
            </Badge>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 transition-colors opacity-0 group-hover:opacity-100"
        >
          {actionLabel}
          <Pencil className="h-3 w-3" />
        </button>
      </div>

      {/* Subtitle row */}
      <p className="text-xs text-muted-foreground mb-3">
        {order.doctor_name || "—"}
        {order.id && <span className="ml-3">Order ID: #{order.id}</span>}
      </p>

      {/* Progress stages */}
      <div className="flex gap-4">
        {allStages.map((stage) => {
          const isDelivery = stage.key === "delivery";
          const done = isDelivery
            ? (order.status === "delivered")
            : completedStages.has(stage.key as any);
          const stageEvent = isDelivery ? null : timeline.find((t) => t.stage === stage.key);
          const dateLabel = isDelivery ? formattedDue : stageEvent ? formatDate(stageEvent.timestamp) : null;
          const barColor = done
            ? (isOverdue && isDelivery ? "bg-destructive" : "bg-foreground")
            : "bg-border";

          return (
            <div key={stage.key} className="flex-1 flex flex-col gap-1 min-w-0">
              <div className={`h-[2px] w-full rounded-full ${barColor}`} />
              <span className={`text-[11px] font-medium leading-snug mt-0.5 ${isDelivery && isOverdue ? "text-destructive" : "text-foreground"}`}>
                {stage.label}
              </span>
              {dateLabel && (
                <span className={`text-[11px] leading-none ${isDelivery && isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                  {dateLabel}
                </span>
              )}
            </div>
          );
        })}
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
    counts.unsubmitted_scans = orders.filter((o) => o.status === "new").length;
    counts.needs_review = orders.filter((o) => o.status === "waiting_review").length;
    counts.design_preview_review = orders.filter((o) => o.status === "in_progress").length;
    counts.on_hold = orders.filter((o) => o.status === "on_hold").length;
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
          <div className="flex-1 overflow-auto">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Package className="h-12 w-12 mb-3 opacity-30" />
                <p className="font-medium">No orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {grouped.map((group) =>
                  group.orders.map((order, i) => (
                    <OrderRow key={order.id} order={order} index={i} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
