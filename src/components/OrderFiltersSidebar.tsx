import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarTab {
  key: string;
  label: string;
  count?: number;
}

const statusTabs: SidebarTab[] = [
  { key: "all", label: "All orders" },
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Progress" },
  { key: "waiting_review", label: "Waiting for Review" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
];

const priorityTabs: SidebarTab[] = [
  { key: "p_all", label: "All priorities" },
  { key: "p_high", label: "High" },
  { key: "p_medium", label: "Medium" },
  { key: "p_low", label: "Low" },
];

const labTabs: SidebarTab[] = [
  { key: "l_all", label: "All labs" },
  { key: "l_Zircon", label: "Zircon" },
  { key: "l_E.Max", label: "E.Max" },
  { key: "l_PFM", label: "PFM" },
];

function TabButton({
  tab,
  active,
  count,
  onClick,
}: {
  tab: SidebarTab;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 text-[13px] transition-colors flex items-center justify-between",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground hover:bg-secondary"
      )}
    >
      <span className="truncate">{tab.label}</span>
      {count !== undefined && count > 0 && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

interface OrderFiltersSidebarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  tabCounts: Record<string, number>;
}

export function OrderFiltersSidebar({ activeTab, onTabChange, tabCounts }: OrderFiltersSidebarProps) {
  return (
    <div className="w-64 border-r shrink-0 hidden lg:flex flex-col h-full bg-card">
      <ScrollArea className="flex-1">
        <div className="py-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Status
          </div>
          {statusTabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={activeTab === tab.key}
              count={tabCounts[tab.key]}
              onClick={() => onTabChange(tab.key)}
            />
          ))}

          <Separator className="my-2" />
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Priority
          </div>
          {priorityTabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={activeTab === tab.key}
              count={tabCounts[tab.key]}
              onClick={() => onTabChange(tab.key)}
            />
          ))}

          <Separator className="my-2" />
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Lab Type
          </div>
          {labTabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={activeTab === tab.key}
              count={tabCounts[tab.key]}
              onClick={() => onTabChange(tab.key)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
