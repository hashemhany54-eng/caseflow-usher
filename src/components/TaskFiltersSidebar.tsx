import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarTab {
  key: string;
  label: string;
  count?: number;
}

const categoryTabs: SidebarTab[] = [
  { key: "my_tasks", label: "Your tasks" },
  { key: "completed", label: "Completed tasks" },
  { key: "assigned_others", label: "Assigned to others" },
  { key: "unassigned", label: "All unassigned" },
  { key: "waiting_practice", label: "Waiting on Practice" },
];

const scanReviewTabs: SidebarTab[] = [
  { key: "design_prep", label: "Design prep" },
  { key: "automate_review", label: "Automate review" },
  { key: "dandy_design", label: "Atomica design" },
  { key: "design_review", label: "Design review" },
  { key: "double_design_qc", label: "Double Design QC" },
  { key: "design_preview_verification", label: "Design Preview verification" },
  { key: "shade_design", label: "Shade design" },
];

const orderReviewTabs: SidebarTab[] = [
  { key: "resolve_hold", label: "Resolve hold" },
  { key: "resolve_flagged_scan", label: "Resolve flagged scan" },
];

interface TaskFiltersSidebarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  tabCounts: Record<string, number>;
}

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

export function TaskFiltersSidebar({ activeTab, onTabChange, tabCounts }: TaskFiltersSidebarProps) {
  return (
    <div className="w-64 border-r shrink-0 hidden lg:flex flex-col h-full bg-card">
      <ScrollArea className="flex-1">
        <div className="py-1">
          {categoryTabs.map((tab) => (
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
            Scan review
          </div>
          {scanReviewTabs.map((tab) => (
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
            Order review
          </div>
          {orderReviewTabs.map((tab) => (
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
