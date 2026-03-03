import { PauseCircle } from "lucide-react";

export default function OnHoldPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">On Hold</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Cases currently on hold</p>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <PauseCircle className="h-12 w-12 mb-3 opacity-30" />
        <p className="font-medium">No cases on hold</p>
      </div>
    </div>
  );
}
