import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine } from "lucide-react";

export function OrderScansSection() {
  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Order Scans</h2>
        <Button variant="outline" size="sm" className="text-xs h-7">Scan History</Button>
      </div>
      <div className="flex items-center gap-3">
        <ScanLine className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="latest">
          <SelectTrigger className="h-8 text-xs w-48">
            <SelectValue placeholder="Select Scan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest Scan (v3)</SelectItem>
            <SelectItem value="v2">Scan v2</SelectItem>
            <SelectItem value="v1">Scan v1 (Original)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
