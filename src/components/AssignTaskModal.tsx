import { useState } from "react";
import { Task, Priority } from "@/types";
import { mockDoctors } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AssignTaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    taskId: string;
    doctorId: string;
    estimatedTime: string;
    priority: Priority;
    note: string;
  }) => void;
}

const timeOptions = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1.5h", label: "1.5 hours" },
  { value: "2h", label: "2 hours" },
];

const priorityOptions: { value: Priority; label: string; className: string }[] = [
  { value: "low", label: "Low", className: "bg-muted text-muted-foreground border-border" },
  { value: "medium", label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  { value: "high", label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
];

export function AssignTaskModal({ task, open, onOpenChange, onSubmit }: AssignTaskModalProps) {
  const [doctorId, setDoctorId] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("1h");
  const [priority, setPriority] = useState<Priority>("medium");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!task) return;
    onSubmit({
      taskId: task.id,
      doctorId,
      estimatedTime,
      priority,
      note,
    });
    // Reset
    setDoctorId("");
    setEstimatedTime("1h");
    setPriority("medium");
    setNote("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setDoctorId("");
    setEstimatedTime("1h");
    setPriority("medium");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Assign Task</DialogTitle>
          {task && (
            <p className="text-xs text-muted-foreground mt-1">
              {task.task_type} · {task.order?.patient_name}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Doctor */}
          <div className="space-y-1.5">
            <Label className="text-xs">Assign to Doctor</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select doctor..." />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Time */}
          <div className="space-y-1.5">
            <Label className="text-xs">Estimated Time</Label>
            <Select value={estimatedTime} onValueChange={setEstimatedTime}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <div className="flex gap-2">
              {priorityOptions.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-full justify-center py-1.5 text-xs font-medium cursor-pointer transition-all",
                      p.className,
                      priority === p.value
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    {p.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs">Task Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-[80px] text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!doctorId}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
