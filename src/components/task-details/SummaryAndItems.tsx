import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const selectedTeeth = [13, 16, 32];

// FDI tooth positions for the arch SVG
const upperRight = [18,17,16,15,14,13,12,11];
const upperLeft = [21,22,23,24,25,26,27,28];
const lowerLeft = [38,37,36,35,34,33,32,31];
const lowerRight = [41,42,43,44,45,46,47,48];

// Approximate positions for each tooth on the arch (cx, cy)
const toothPositions: Record<number, [number, number]> = {
  // Upper right (patient's right = viewer's left)
  18: [52, 200], 17: [56, 170], 16: [64, 142], 15: [76, 118],
  14: [92, 98], 13: [112, 82], 12: [134, 70], 11: [160, 64],
  // Upper left
  21: [200, 64], 22: [226, 70], 23: [248, 82], 24: [268, 98],
  25: [284, 118], 26: [296, 142], 27: [304, 170], 28: [308, 200],
  // Lower left
  38: [308, 320], 37: [304, 350], 36: [296, 374], 35: [284, 396],
  34: [268, 414], 33: [248, 428], 32: [226, 438], 31: [200, 444],
  // Lower right
  41: [160, 444], 42: [134, 438], 43: [112, 428], 44: [92, 414],
  45: [76, 396], 46: [64, 374], 47: [56, 350], 48: [52, 320],
};

// Label offsets (dx, dy from tooth center)
const labelOffsets: Record<number, [number, number]> = {
  18: [-20, 0], 17: [-22, -4], 16: [-24, -4], 15: [-22, -6],
  14: [-22, -6], 13: [-24, -4], 12: [-18, -10], 11: [-12, -14],
  21: [12, -14], 22: [18, -10], 23: [24, -4], 24: [22, -6],
  25: [22, -6], 26: [24, -4], 27: [22, -4], 28: [20, 0],
  38: [20, 0], 37: [22, 4], 36: [24, 4], 35: [22, 6],
  34: [22, 6], 33: [24, 4], 32: [18, 10], 31: [12, 14],
  41: [-12, 14], 42: [-18, 10], 43: [-24, 4], 44: [-22, 6],
  45: [-22, 6], 46: [-24, 4], 47: [-22, 4], 48: [-20, 0],
};

function DentalArch() {
  const allTeeth = [...upperRight, ...upperLeft, ...lowerLeft, ...lowerRight];

  return (
    <svg viewBox="20 30 320 450" className="w-full max-w-[280px] mx-auto">
      {/* Upper arch outline */}
      <path
        d="M52,200 Q50,140 76,100 Q110,56 180,54 Q250,56 284,100 Q310,140 308,200"
        fill="none" stroke="hsl(var(--border))" strokeWidth="28" strokeLinecap="round"
        opacity="0.3"
      />
      {/* Lower arch outline */}
      <path
        d="M52,320 Q50,380 76,416 Q110,456 180,458 Q250,456 284,416 Q310,380 308,320"
        fill="none" stroke="hsl(var(--border))" strokeWidth="28" strokeLinecap="round"
        opacity="0.3"
      />

      {allTeeth.map((tooth) => {
        const [cx, cy] = toothPositions[tooth];
        const isSelected = selectedTeeth.includes(tooth);
        const [lx, ly] = labelOffsets[tooth] || [0, -18];

        return (
          <g key={tooth}>
            {/* Tooth shape */}
            <circle
              cx={cx} cy={cy} r={10}
              fill={isSelected ? "hsl(var(--primary))" : "none"}
              stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={1.5}
            />
            {/* Tooth number label */}
            <text
              x={cx + lx} y={cy + ly}
              textAnchor="middle" dominantBaseline="central"
              fontSize={isSelected ? 11 : 9}
              fontWeight={isSelected ? 700 : 400}
              fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            >
              {tooth}
            </text>
            {/* Selected indicator dot */}
            {isSelected && (
              <circle
                cx={cx + lx + (lx > 0 ? 12 : -12)} cy={cy + ly}
                r={3} fill="hsl(var(--primary))"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

const mockItems = [
  {
    id: "item-1",
    treatment: "Crown",
    material: "Full Contour Zirconia",
    teeth: [13, 16],
    notes: "Bridge from 13–16",
    smileStyle: "Natural",
    labRecommendation: "Monolithic",
    diastema: "None",
  },
  {
    id: "item-2",
    treatment: "Crown",
    material: "Full Contour Zirconia",
    teeth: [32],
    notes: "Individual crown",
    smileStyle: "Natural",
    labRecommendation: "Monolithic",
    diastema: "None",
  },
];

export function SummaryAndItems() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Summary - Dental Arch */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Summary</h2>
        <DentalArch />
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {selectedTeeth.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">#{t}</Badge>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {mockItems.map((item) => (
            <div key={item.id} className="rounded-md border p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{item.treatment}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.material}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span className="text-muted-foreground">Notes: <span className="text-foreground">{item.notes}</span></span>
                <span className="text-muted-foreground">Waxup Teeth: <span className="text-foreground">{item.teeth.map(t => `#${t}`).join(", ")}</span></span>
                <span className="text-muted-foreground">Smile Style: <span className="text-foreground">{item.smileStyle}</span></span>
                <span className="text-muted-foreground">Lab Rec: <span className="text-foreground">{item.labRecommendation}</span></span>
                <span className="text-muted-foreground">Diastema: <span className="text-foreground">{item.diastema}</span></span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="text-xs h-7">Modify Rx</Button>
          <Button variant="outline" size="sm" className="text-xs h-7">New Item</Button>
          <Button variant="outline" size="sm" className="text-xs h-7">Manage Splits</Button>
        </div>
      </div>
    </div>
  );
}
