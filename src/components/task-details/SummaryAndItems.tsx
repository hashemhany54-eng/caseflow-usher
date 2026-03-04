import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const selectedTeeth = [6, 7, 8, 9, 10, 11];
const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
const lowerTeeth = Array.from({ length: 16 }, (_, i) => 17 + i);

const mockItems = [
  {
    id: "item-1",
    treatment: "Crown",
    material: "Full Contour Zirconia",
    teeth: [6, 7, 8],
    notes: "Bridge from 6–8",
    smileStyle: "Natural",
    labRecommendation: "Monolithic",
    diastema: "None",
  },
  {
    id: "item-2",
    treatment: "Crown",
    material: "Full Contour Zirconia",
    teeth: [9, 10, 11],
    notes: "Individual crowns",
    smileStyle: "Natural",
    labRecommendation: "Monolithic",
    diastema: "None",
  },
];

function ToothChart() {
  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-[2px]">
        {upperTeeth.map((t) => (
          <div
            key={t}
            className={`w-5 h-6 rounded-sm text-[8px] flex items-center justify-center font-medium border ${
              selectedTeeth.includes(t)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border"
            }`}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-[2px]">
        {lowerTeeth.map((t) => (
          <div
            key={t}
            className={`w-5 h-6 rounded-sm text-[8px] flex items-center justify-center font-medium border ${
              selectedTeeth.includes(t)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border"
            }`}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SummaryAndItems() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Summary - Dental Arch */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Summary</h2>
        <ToothChart />
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
