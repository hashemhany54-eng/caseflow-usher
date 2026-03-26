import { useState, Suspense, useRef, useMemo } from "react";
import { ChevronDown, ChevronRight, Eye, Save, Download, Rotate3D, Move, ZoomIn, Crosshair, Box, ScanLine, Flame, ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

// --- 3D Model & Shaders (extracted) ---

const heatmapVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const heatmapFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 contactPoints[8];
  uniform int numContacts;
  uniform float contactRadii[8];

  vec3 heatColor(float t) {
    if (t < 0.25) return mix(vec3(0.0, 0.8, 0.0), vec3(0.5, 0.9, 0.0), t / 0.25);
    if (t < 0.5) return mix(vec3(0.5, 0.9, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.25) / 0.25);
    if (t < 0.75) return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.5, 0.0), (t - 0.5) / 0.25);
    return mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.75) / 0.25);
  }

  void main() {
    vec3 baseColor = vec3(0.85, 0.82, 0.78);
    float maxHeat = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= numContacts) break;
      float dist = distance(vPosition, contactPoints[i]);
      float radius = contactRadii[i];
      float heat = 1.0 - smoothstep(0.0, radius, dist);
      maxHeat = max(maxHeat, heat);
    }
    vec3 color = baseColor;
    if (maxHeat > 0.05) {
      vec3 heat = heatColor(maxHeat);
      color = mix(baseColor, heat, maxHeat * 0.9);
    }
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0) * 0.6 + 0.4;
    gl_FragColor = vec4(color * diff, 1.0);
  }
`;

function TeethModel({ heatmap }: { heatmap: boolean }) {
  const geometry = useLoader(STLLoader, "/models/Upper_teeth.stl");
  const meshRef = useRef<THREE.Mesh>(null);

  const { contactPoints, contactRadii } = useMemo(() => {
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    const cz = (bb.min.z + bb.max.z) / 2;
    const sx = bb.max.x - bb.min.x;
    const sy = bb.max.y - bb.min.y;
    const points = [
      new THREE.Vector3(cx - sx * 0.3, cy + sy * 0.1, cz),
      new THREE.Vector3(cx - sx * 0.15, cy + sy * 0.15, cz),
      new THREE.Vector3(cx + sx * 0.05, cy + sy * 0.12, cz),
      new THREE.Vector3(cx + sx * 0.2, cy + sy * 0.1, cz),
      new THREE.Vector3(cx + sx * 0.35, cy + sy * 0.05, cz),
      new THREE.Vector3(cx - sx * 0.35, cy - sy * 0.1, cz),
      new THREE.Vector3(cx + sx * 0.15, cy - sy * 0.15, cz),
      new THREE.Vector3(cx - sx * 0.05, cy - sy * 0.05, cz),
    ];
    const radii = [4.0, 3.5, 5.0, 3.0, 4.5, 3.5, 4.0, 3.0];
    return { contactPoints: points, contactRadii: radii };
  }, [geometry]);

  const shaderUniforms = useMemo(() => ({
    contactPoints: { value: contactPoints },
    numContacts: { value: contactPoints.length },
    contactRadii: { value: contactRadii },
  }), [contactPoints, contactRadii]);

  if (heatmap) {
    return (
      <Center>
        <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
          <shaderMaterial vertexShader={heatmapVertexShader} fragmentShader={heatmapFragmentShader} uniforms={shaderUniforms} />
        </mesh>
      </Center>
    );
  }

  return (
    <Center>
      <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="hsl(40, 20%, 88%)" roughness={0.3} metalness={0.1} />
      </mesh>
    </Center>
  );
}

// --- Sidebar data ---

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

// --- Sub-components ---

function HeatmapLegend() {
  return (
    <div className="absolute top-3 left-[280px] z-10 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm p-2 flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <ArrowUp className="h-3 w-3" />
        <ZoomIn className="h-3 w-3" />
      </div>
      <div className="text-[10px] text-muted-foreground font-medium">0.4mm</div>
      <div className="w-4 h-[120px] rounded-sm" style={{ background: "linear-gradient(to bottom, #ff0000, #ff8800, #ffff00, #88dd00, #00cc00)" }} />
      <div className="text-[10px] text-muted-foreground font-medium">0.0mm</div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <ArrowDown className="h-3 w-3" />
        <ZoomIn className="h-3 w-3" />
      </div>
    </div>
  );
}

function ViewsSidebar({ openSections, toggleSection }: { openSections: Record<string, boolean>; toggleSection: (l: string) => void }) {
  return (
    <div className="bg-card rounded-lg border shadow-sm w-[220px]">
      <div className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold">
        Views
      </div>
      <div className="px-1 pb-2 space-y-0.5">
        {viewGroups.map((group) => (
          <div key={group.label}>
            <Button variant="ghost" onClick={() => toggleSection(group.label)} className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-foreground h-auto justify-start">
              {openSections[group.label] ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              {group.label}
            </Button>
            {openSections[group.label] && (
              <div className="ml-5 space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground">
                    <span>{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.icons.map((ic, idx) => (
                        <ic.icon key={idx} className={cn("h-3 w-3", ic.active ? "text-primary" : "text-muted-foreground/50")} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesSidebar() {
  const [comments, setComments] = useState<string[]>([
    "Please check occlusal contacts on #14 and #15.",
    "Material preference: Zirconia multi-layered.",
  ]);

  return (
    <div className="bg-card rounded-lg border shadow-sm w-[220px]">
      <div className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold">
        General Notes
      </div>
      <div className="px-3 pb-3 space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="text-[11px] text-muted-foreground leading-relaxed border-b border-border pb-2 last:border-0">
            {c}
          </div>
        ))}
        <Button variant="secondary" size="sm" className="w-full text-xs h-7 gap-1.5 mt-1">
          <MessageSquare className="h-3 w-3" />
          Add Comment
        </Button>
      </div>
    </div>
  );
}

function GeneralNotesSection() {
  return (
    <div className="bg-card rounded-lg border shadow-sm w-[220px] mt-2">
      <div className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold">
        General Notes
      </div>
      <div className="px-3 pb-3 space-y-2">
        <div>
          <div className="text-[10px] font-medium text-foreground mb-1">Doctor Notes</div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Patient requires special attention on margins. Verify contacts with adjacent teeth before finalizing.
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarPanel({ heatmapEnabled, setHeatmapEnabled, activeTool, setActiveTool }: {
  heatmapEnabled: boolean; setHeatmapEnabled: (v: boolean) => void;
  activeTool: string; setActiveTool: (v: string) => void;
}) {
  return (
    <div className="bg-card rounded-lg border shadow-sm flex flex-col items-center py-1.5 px-1 gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setHeatmapEnabled(!heatmapEnabled)} className={cn("h-8 w-8", heatmapEnabled && "bg-primary text-primary-foreground hover:bg-primary/90")}>
            <Flame className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right"><p className="text-xs">Toggle Heatmap</p></TooltipContent>
      </Tooltip>
      <div className="w-5 border-t border-border my-1" />
      {toolbarItems.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setActiveTool(tool.id)} className={cn("h-8 w-8", activeTool === tool.id && "bg-primary text-primary-foreground hover:bg-primary/90")}>
              <tool.icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right"><p className="text-xs">{tool.label}</p></TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

// --- Main Component ---

type DesignMode = "design" | "treatment-plan" | "surgical-guide";

export function DesignWorkspace() {
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [activeTool, setActiveTool] = useState("rotate");
  const [mode, setMode] = useState<DesignMode>("design");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Scans: true,
    Restoratives: true,
    "Order Scans": true,
  });

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Compute toolbar left offset based on sidebar presence
  const sidebarWidth = mode === "design" ? 220 : 220;
  const toolbarLeft = sidebarWidth + 20; // 220px sidebar + gap
  const heatmapLegendLeft = toolbarLeft + 50;

  return (
    <div className="flex h-full w-full bg-muted/30 relative">
      {/* Left Sidebar - varies by mode */}
      <div className="absolute top-3 left-3 z-10">
        {mode === "design" && <NotesSidebar />}
        {mode === "treatment-plan" && (
          <>
            <ViewsSidebar openSections={openSections} toggleSection={toggleSection} />
            <GeneralNotesSection />
          </>
        )}
        {mode === "surgical-guide" && (
          <ViewsSidebar openSections={openSections} toggleSection={toggleSection} />
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute top-3 z-10" style={{ left: `${toolbarLeft}px` }}>
        <ToolbarPanel
          heatmapEnabled={heatmapEnabled}
          setHeatmapEnabled={setHeatmapEnabled}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />
      </div>

      {/* Heatmap Legend */}
      {heatmapEnabled && (
        <div className="absolute top-3 z-10" style={{ left: `${heatmapLegendLeft}px` }}>
          <HeatmapLegend />
        </div>
      )}

      {/* 3D Viewer */}
      <div className="flex-1">
        <Canvas camera={{ position: [0, 0, 120], fov: 45 }} style={{ background: "transparent" }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={0.8} />
          <directionalLight position={[-10, -5, -10]} intensity={0.3} />
          <Suspense fallback={null}>
            <TeethModel heatmap={heatmapEnabled} />
          </Suspense>
          <OrbitControls enableDamping dampingFactor={0.1} />
        </Canvas>
      </div>

      {/* Top-right actions */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <Select value={mode} onValueChange={(v) => setMode(v as DesignMode)}>
          <SelectTrigger className="h-7 w-[150px] text-xs bg-card border shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="treatment-plan">Treatment Plan</SelectItem>
            <SelectItem value="surgical-guide">Surgical Guide</SelectItem>
          </SelectContent>
        </Select>
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
