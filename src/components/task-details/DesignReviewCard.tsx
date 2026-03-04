import { Button } from "@/components/ui/button";
import { CheckCircle2, SkipForward } from "lucide-react";

interface Props {
  onReview: () => void;
  onSkip: () => void;
}

export function DesignReviewCard({ onReview, onSkip }: Props) {
  return (
    <div className="rounded-lg border bg-card p-5 mb-4">
      <h2 className="text-sm font-semibold mb-1">Design Review</h2>
      <p className="text-xs text-muted-foreground mb-3">Design completed by internal designer</p>
      <div className="flex gap-3">
        <Button onClick={onReview} className="flex-1 gap-2">
          <CheckCircle2 className="h-4 w-4" /> Review Design
        </Button>
        <Button onClick={onSkip} variant="outline" className="gap-2">
          <SkipForward className="h-4 w-4" /> Skip Design Review
        </Button>
      </div>
    </div>
  );
}
