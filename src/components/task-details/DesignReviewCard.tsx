import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Link, X, FileUp, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Props {
  onReview: () => void;
}

export function DesignReviewCard({ onReview }: Props) {
  const [open, setOpen] = useState(false);
  const [scanQuality, setScanQuality] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComplete = () => {
    onReview();
    setOpen(false);
  };

  const handleCancel = () => {
    setFile(null);
    setNote("");
    setVideoUrl("");
    setScanQuality(false);
    setOpen(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold mb-1">Design Review</h2>
      <p className="text-xs text-muted-foreground mb-3">Design completed by internal designer</p>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Upload className="h-4 w-4" /> Upload Design
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[360px] sm:max-w-[360px] flex flex-col p-0">
          <SheetHeader className="p-5 pb-3 border-b">
            <SheetTitle className="text-base">Complete design</SheetTitle>
            <SheetDescription className="sr-only">Upload completed design files</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-5 space-y-5">
            {/* Scan Quality */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="scan-quality"
                checked={scanQuality}
                onCheckedChange={(v) => setScanQuality(!!v)}
              />
              <Label htmlFor="scan-quality" className="text-sm font-medium">Scan Quality</Label>
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Completed design file</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FileUp className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Drag & drop files here or</p>
                    <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                      <Upload className="h-3.5 w-3.5" /> Select files
                    </Button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Want to leave a note?</Label>
              <Textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Video URL */}
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Attach video to digital design preview</Label>
              <div className="relative">
                <Input
                  placeholder="Video Design Review URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-5 flex items-center gap-3">
            <Button variant="ghost" onClick={handleCancel} className="text-primary">
              Cancel
            </Button>
            <Button onClick={handleComplete} className="gap-1.5">
              Complete ✓
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
