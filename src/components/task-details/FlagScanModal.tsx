import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import { toast } from "sonner";

export function FlagScanModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    toast.success("Scan flagged successfully");
    setOpen(false);
    setReason("");
    setComments("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive">
          <Flag className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Flag Scan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Flag Scan Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Issue Type</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distortion">Distortion / Scan Error</SelectItem>
                <SelectItem value="insufficient">Insufficient Images / Landmarks</SelectItem>
                <SelectItem value="artifacts">Scan Artifacts</SelectItem>
                <SelectItem value="missing_teeth">Missing Teeth Data</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Comments</Label>
            <Textarea
              placeholder="Describe the scan issue..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSubmit} disabled={!reason}>Submit Flag</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
