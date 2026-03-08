import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarTab {
  key: string;
  label: string;
  count?: number;
}

const reviewTabs: SidebarTab[] = [
  { key: "all", label: "All" },
  { key: "unsubmitted_scans", label: "Unsubmitted scans" },
  { key: "needs_review", label: "Needs Review" },
  { key: "design_preview_review", label: "Design Preview Review" },
  { key: "on_hold", label: "On hold" },
];

const statusTabs: SidebarTab[] = [
  { key: "new", label: "New" },
  { key: "fabrication", label: "Fabrication" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "canceled", label: "Canceled" },
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
          {reviewTabs.map((tab) => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={activeTab === tab.key}
              count={tabCounts[tab.key]}
              onClick={() => onTabChange(tab.key)}
            />
          ))}

          <Separator className="my-2" />

          {statusTabs.map((tab) => (
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
