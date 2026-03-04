import { TimelineEvent } from "@/types";

const stageLabels: Record<string, string> = {
  order_placed: "Order Placed",
  design: "Design",
  qc: "QC",
  preview: "Design Preview",
  model: "Model",
};
const stages = ["order_placed", "design", "qc", "preview", "model"];

interface Props {
  timeline: TimelineEvent[];
}

export function DesignTimeline({ timeline }: Props) {
  const completedStages = new Set(timeline.map((t) => t.stage));
  const timelineByStage = Object.fromEntries(timeline.map((t) => [t.stage, t]));

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
        return (
          <div key={stage} className="flex-1 flex flex-col gap-1">
            <div className={`h-[3px] w-full rounded-full ${done ? "bg-foreground" : "bg-muted"}`} />
            <span className="text-[11px] font-medium text-foreground leading-tight">
              {stageLabels[stage]}
            </span>
            {event && (
              <span className="text-[10px] text-muted-foreground leading-none">
                {event.action_by} • {relativeTime(event.timestamp)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
