import { TimelineEvent } from "@/types";
import { Check } from "lucide-react";

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

  // Find latest completed stage
  const latestStage = [...stages].reverse().find((s) => completedStages.has(s as any));

  function relativeTime(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="flex w-full gap-4 py-6">
      {stages.map((stage) => {
        const done = completedStages.has(stage as any);
        const event = timelineByStage[stage];
        const isLatest = stage === latestStage;
        return (
          <div key={stage} className="flex-1 flex flex-col gap-1.5 group/stage">
            <div className={`h-[3px] w-full rounded-full transition-colors ${done ? "bg-primary" : "bg-muted"}`} />
            {isLatest ? (
              <>
                <span className="text-xs font-medium text-primary leading-tight">
                  {stageLabels[stage]}
                </span>
                {event && (
                  <span className="text-[10px] text-muted-foreground leading-none">
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
                <span className="text-xs font-medium text-foreground leading-tight">
                  {stageLabels[stage]}
                </span>
                {event && (
                  <span className="text-[10px] text-muted-foreground leading-none">
                    {event.assignee
                      ? event.due
                        ? `${event.assignee} — Due in ${event.due}`
                        : event.assignee
                      : `${event.action_by} · ${relativeTime(event.timestamp)}`}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-[10px] text-muted-foreground/40 leading-tight">
                  {stageLabels[stage]}
                </span>
                {event?.assignee && (
                  <span className="text-[10px] text-muted-foreground/30 leading-none">
                    {event.due ? `${event.assignee} — Due in ${event.due}` : event.assignee}
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
