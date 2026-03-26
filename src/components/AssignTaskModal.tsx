import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const doctors = [
  { id: "u1", name: "Dr. William" },
  { id: "u2", name: "Dr. Alex Rivera" },
  { id: "u3", name: "Dr. Sarah Chen" },
  { id: "u4", name: "Dr. Lisa Park" },
  { id: "u5", name: "Dr. James Wright" },
];

const timeOptions = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1.5h", label: "1.5 hours" },
  { value: "2h", label: "2 hours" },
];

const priorities = ["low", "medium", "high"] as const;

interface AssignTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { doctorId: string; estimatedTime: string; priority: string; notes: string }) => void;
  taskType?: string;
}

export function AssignTaskModal({ open, onClose, onSubmit, taskType }: AssignTaskModalProps) {
  const [doctorId, setDoctorId] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("1h");
  const [priority, setPriority] = useState<string>("medium");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!doctorId) return;
    onSubmit({ doctorId, estimatedTime, priority, notes });
    setDoctorId("");
    setEstimatedTime("1h");
    setPriority("medium");
    setNotes("");
  };

  const handleClose = () => {
    setDoctorId("");
    setEstimatedTime("1h");
    setPriority("medium");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Assign Task</DialogTitle>
          {taskType && (
            <p className="text-xs text-muted-foreground mt-1">{taskType}</p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Doctor */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Assign to Doctor</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Time */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Estimated Time</Label>
            <Select value={estimatedTime} onValueChange={setEstimatedTime}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Priority</Label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <Badge
                  key={p}
                  variant={priority === p ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer capitalize text-xs px-3 py-1 transition-colors",
                    priority === p && p === "high" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    priority === p && p === "medium" && "bg-warning text-warning-foreground hover:bg-warning/90",
                    priority === p && p === "low" && "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!doctorId}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}