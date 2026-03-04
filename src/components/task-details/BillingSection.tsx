import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export function BillingSection() {
  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <h2 className="text-sm font-semibold mb-3">Billing</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Practice Total</p>
            <p className="text-lg font-bold">$64.00</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7">Pricing History</Button>
          <Button variant="outline" size="sm" className="text-xs h-7">Ledger</Button>
        </div>
      </div>
    </div>
  );
}
