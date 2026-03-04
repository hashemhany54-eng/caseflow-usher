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
    <div>
      <h2 className="text-sm font-semibold mb-4">Workflow Timeline</h2>
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => {
          const done = completedStages.has(stage as any);
          const event = timelineByStage[stage];
          return (
            <div key={stage} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors cursor-pointer hover:ring-2 hover:ring-primary/30 ${
                  done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {done ? "✓" : i + 1}
                </div>
                <span className="text-[10px] mt-1 text-muted-foreground">{stageLabels[stage]}</span>
                {event && (
                  <span className="text-[9px] text-muted-foreground">{event.action_by} • {relativeTime(event.timestamp)}</span>
                )}
              </div>
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
