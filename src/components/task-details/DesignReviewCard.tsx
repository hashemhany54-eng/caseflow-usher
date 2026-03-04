import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Props {
  onReview: () => void;
}

export function DesignReviewCard({ onReview }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-1">Design Review</h2>
      <p className="text-xs text-muted-foreground mb-3">Design completed by internal designer</p>
      <Button onClick={onReview} className="gap-2">
        <CheckCircle2 className="h-4 w-4" /> Review Design
      </Button>
    </div>
  );
}
