import { TimelineEvent } from "@/types";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stageLabels: Record<string, string> = {
  order_placed: "Order Placed",
  design: "Design",
  qc: "QC",
  preview: "Design Preview",
  model: "Model"
};
const stages = ["order_placed", "design", "qc", "preview", "model"];

interface Props {
  timeline: TimelineEvent[];
}

export function DesignTimeline({ timeline }: Props) {
  const completedStages = new Set(timeline.map((t) => t.stage));
  const timelineByStage = Object.fromEntries(timeline.map((t) => [t.stage, t]));

  const latestStage = [...stages].reverse().find((s) => completedStages.has(s as any));

  function relativeTime(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="flex w-full gap-3">
      {stages.map((stage) => {
        const done = completedStages.has(stage as any);
        const event = timelineByStage[stage];
        const isLatest = stage === latestStage;
        return (
          <div key={stage} className={cn(
            "flex-1 flex flex-col gap-1.5 group/stage rounded-md px-3 py-2.5 transition-colors",
            isLatest && "bg-accent/80 border border-primary/10"
          )}>
            <div className={cn(
              "h-[3px] w-full rounded-full transition-colors",
              isLatest ? "bg-primary" : done ? "bg-primary/40" : "bg-muted"
            )} />
            {isLatest ? (
              <>
                <span className="text-xs font-semibold text-primary leading-tight">
                  {stageLabels[stage]}
                </span>
                {event && (
                  <span className="text-[10px] text-foreground/70 leading-none">
                    {event.assignee
                      ? event.due
                        ? `${event.assignee} — Due in ${event.due}`
                        : event.assignee
                      : `${event.action_by} · ${relativeTime(event.timestamp)}`}
                  </span>
                )}
              </>
            ) : done ? (
              <>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-primary/40" />
                  <span className="text-[10px] text-muted-foreground/50">
                    {stageLabels[stage]}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground/30 leading-tight">
                {stageLabels[stage]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
