import { useState } from "react";
import { ChevronDown, ChevronRight, Eye, Save, Download, Rotate3D, Move, ZoomIn, Crosshair, Box, ScanLine, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ViewItem {
  label: string;
  icons: { icon: React.ElementType; active?: boolean }[];
}

const viewGroups: { label: string; items: ViewItem[] }[] = [
  {
    label: "Scans",
    items: [
      { label: "Upper Scan", icons: [{ icon: Eye, active: true }] },
      { label: "Lower Scan", icons: [{ icon: Eye, active: true }] },
    ],
  },
  {
    label: "Restoratives",
    items: [
      { label: "Crowns", icons: [{ icon: Save }, { icon: Eye, active: true }] },
      { label: "Bridge", icons: [{ icon: Save }, { icon: Eye }] },
    ],
  },
  {
    label: "Order Scans",
    items: [
      { label: "Pre-op Scan", icons: [{ icon: Eye, active: true }] },
    ],
  },
];

const toolbarItems: { icon: React.ElementType; label: string; id: string }[] = [
  { icon: Move, label: "Pan", id: "pan" },
  { icon: Rotate3D, label: "Rotate", id: "rotate" },
  { icon: ZoomIn, label: "Zoom", id: "zoom" },
  { icon: Crosshair, label: "Point of Interest", id: "poi" },
  { icon: Box, label: "Cross Section", id: "cross-section" },
  { icon: ScanLine, label: "Measurements", id: "measure" },
];

export function DesignWorkspace() {
  const [viewsOpen, setViewsOpen] = useState(true);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [activeTool, setActiveTool] = useState("rotate");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Scans: true,
    Restoratives: true,
    "Order Scans": true,
  });

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex h-full w-full bg-muted/30 relative">
      {/* Views Panel */}
      <Collapsible open={viewsOpen} onOpenChange={setViewsOpen}>
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-card rounded-lg border shadow-sm w-[220px]">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold hover:bg-accent/50 rounded-t-lg">
              Views
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", !viewsOpen && "-rotate-90")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-1 pb-2 space-y-0.5">
                {viewGroups.map((group) => (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleSection(group.label)}
                      className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-foreground hover:bg-accent/50 rounded"
                    >
                      {openSections[group.label] ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                      {group.label}
                    </button>
                    {openSections[group.label] && (
                      <div className="ml-5 space-y-0.5">
                        {group.items.map((item) => (
                          <div key={item.label} className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground">
                            <span>{item.label}</span>
                            <div className="flex items-center gap-1">
                              {item.icons.map((ic, idx) => (
                                <ic.icon
                                  key={idx}
                                  className={cn("h-3 w-3", ic.active ? "text-primary" : "text-muted-foreground/50")}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </div>
      </Collapsible>

      {/* Toolbar */}
      <div className="absolute top-3 left-[240px] z-10">
        <div className="bg-card rounded-lg border shadow-sm flex flex-col items-center py-1.5 px-1 gap-0.5">
          {/* Heatmap toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  heatmapEnabled ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Flame className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Toggle Heatmap</p>
            </TooltipContent>
          </Tooltip>

          <div className="w-5 border-t border-border my-1" />

          {toolbarItems.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    activeTool === tool.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <tool.icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Main 3D Viewer Placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Box className="h-16 w-16 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">3D Design Viewer</p>
          <p className="text-xs mt-1">3D model will render here</p>
          {heatmapEnabled && (
            <p className="text-xs mt-2 text-primary font-medium">Heatmap mode active</p>
          )}
        </div>
      </div>

      {/* Top-right actions */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <Button variant="outline" size="sm" className="text-xs h-7 bg-card">
          <Download className="h-3 w-3 mr-1.5" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 bg-card">
          Replace Design
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 bg-card">
          Version History
        </Button>
      </div>
    </div>
  );
}
