import { Badge } from "@/components/ui/badge";
import { Priority } from "@/types";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold px-1.5 py-0 ${config.className}`}>
      {config.label}
    </Badge>
  );
}
