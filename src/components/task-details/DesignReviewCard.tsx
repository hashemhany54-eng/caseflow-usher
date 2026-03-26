import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Link, X, FileUp, CheckCircle2, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { QualityCheckModal } from "./QualityCheckModal";

interface Props {
  onReview: () => void;
  taskType?: string;
  patientName?: string;
  isUnassigned?: boolean;
}

export function DesignReviewCard({ onReview, taskType, patientName, isUnassigned }: Props) {
  const isReview = taskType === "Design Review";
  const isTreatmentPlan = taskType === "Treatment Plan";
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qcOpen, setQcOpen] = useState(false);
  const [scanQuality, setScanQuality] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [implantNotes, setImplantNotes] = useState<{ implantTitle: string; implantNote: string }[]>([
    { implantTitle: "Implant 16", implantNote: "" },
    { implantTitle: "Implant 13", implantNote: "" },
    { implantTitle: "Implant 32", implantNote: "" },
  ]);

  const addImplantNote = () => {
    setImplantNotes((prev) => [...prev, { implantTitle: "", implantNote: "" }]);
  };

  const updateImplantNote = (index: number, field: "implantTitle" | "implantNote", value: string) => {
    setImplantNotes((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeImplantNote = (index: number) => {
    setImplantNotes((prev) => prev.filter((_, i) => i !== index));
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComplete = () => {
    onReview();
    setQcOpen(false);
    setSheetOpen(false);
  };

  const handleCancel = () => {
    setFile(null);
    setNote("");
    setVideoUrl("");
    setScanQuality(false);
    setSheetOpen(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold mb-1">{isReview ? "Design Review" : isTreatmentPlan ? "Treatment Plan" : "Internal Design"}</h2>
      <p className="text-xs text-muted-foreground mb-4">{isReview ? "Design completed by internal designer" : isTreatmentPlan ? "Upload treatment plan files" : "Upload completed design files"}</p>
      
      {/* Primary action */}
      {!isUnassigned && (
        <Button
          onClick={() => isReview ? setQcOpen(true) : setSheetOpen(true)}
          size="lg"
          className="gap-2 shadow-sm"
        >
          {isReview ? <CheckCircle2 className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          {isReview ? "Review Design" : isTreatmentPlan ? "Upload Plan" : "Upload Design"}
        </Button>
      )}

      {/* QC Modal for Design Review */}
      <QualityCheckModal
        open={qcOpen}
        onOpenChange={setQcOpen}
        patientName={patientName}
        onComplete={handleComplete}
      />

      {/* Sheet for Upload Design */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[360px] sm:max-w-[360px] flex flex-col p-0">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="text-base font-display">Complete design</SheetTitle>
            <SheetDescription className="sr-only">Upload completed design files</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="scan-quality"
                checked={scanQuality}
                onCheckedChange={(v) => setScanQuality(!!v)}
              />
              <Label htmlFor="scan-quality" className="text-sm font-medium">Scan Quality</Label>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Completed design file</Label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
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
                    <Button variant="outline" size="sm" className="mt-3 gap-1.5">
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

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Want to leave a note?</Label>
              <Textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Implant Notes */}
            <div className="space-y-3">
              {implantNotes.map((item, index) => (
                <div key={index} className="space-y-2 rounded-md border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">Implant Note {index + 1}</Label>
                    <button
                      onClick={() => removeImplantNote(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Label className="text-sm font-semibold">{item.implantTitle}</Label>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Implant note</Label>
                    <Textarea
                      placeholder="Implant note"
                      value={item.implantNote}
                      onChange={(e) => updateImplantNote(index, "implantNote", e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addImplantNote}>
                <Plus className="h-3 w-3" /> Add Implant Note
              </Button>
            </div>

            <div className="space-y-2">
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

          <div className="border-t p-6 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground">
              Cancel
            </Button>
            <Button onClick={handleComplete} className="gap-1.5 flex-1">
              Complete ✓
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
