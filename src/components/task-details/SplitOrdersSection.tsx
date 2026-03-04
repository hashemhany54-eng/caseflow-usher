import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, GitMerge } from "lucide-react";

export function SplitOrdersSection() {
  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Split Orders</h2>
        <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
          <GitMerge className="h-3 w-3" /> Merge and Stitch
        </Button>
      </div>
      <div className="rounded-md border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium">Split Order: Retainer</p>
            <p className="text-[10px] text-muted-foreground">Created from parent order</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px]">Active</Badge>
      </div>
    </div>
  );
}
