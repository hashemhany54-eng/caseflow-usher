import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, X } from "lucide-react";

import qcGeometry from "@/assets/qc-geometry.jpg";
import qcShadeCheck from "@/assets/qc-shade-check.jpg";
import qcPackage from "@/assets/qc-package.jpg";
import qcFitModel from "@/assets/qc-fit-model.jpg";

interface QualityCheckModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  onComplete: () => void;
}

const otherChecks = [
  { label: "Manual shade check", image: qcShadeCheck },
  { label: "Package contents", image: qcPackage },
  { label: "Fit on model", image: qcFitModel },
];

export function QualityCheckModal({
  open,
  onOpenChange,
  patientName = "Training's surgical guide",
  onComplete,
}: QualityCheckModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-display font-bold">
            Quality check for{" "}
            <span className="text-primary">{patientName} order</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Shade & Geometry row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shade */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold">Shade</h3>
                <Badge
                  variant="outline"
                  className="gap-1 text-xs px-2 py-0.5 bg-accent text-primary border-primary/20"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Shade Guarantee
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Deviation of{" "}
                <span className="text-primary font-semibold">1.0 ΔE or less</span>{" "}
                from the A2 reference
              </p>

              {/* Scanned color card */}
              <div className="rounded-lg border bg-accent/30 p-4 space-y-3">
                <h4 className="text-sm font-semibold">Scanned color</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[11px] text-muted-foreground">CIELab L</span>
                    <p className="text-lg font-bold">83.2</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">CIELab a</span>
                    <p className="text-lg font-bold">1.0</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground">CIELab b</span>
                    <p className="text-lg font-bold">17.9</p>
                  </div>
                </div>
              </div>

              {/* Comparison card */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Comparison with</span>
                  <Badge variant="outline" className="text-xs px-2 py-0 font-semibold">
                    A2
                  </Badge>
                </div>
                <p className="text-base font-bold">Excellent</p>
                <p className="text-xs text-muted-foreground">1.0 ΔE or less</p>
                {/* Color spectrum bar */}
                <div className="relative h-3 rounded-full overflow-hidden mt-1">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, hsl(0 80% 50%), hsl(30 90% 55%), hsl(50 95% 70%), hsl(60 90% 80%), hsl(220 70% 55%))",
                    }}
                  />
                  {/* Indicator triangle */}
                  <div
                    className="absolute top-0 h-full flex items-end"
                    style={{ left: "72%" }}
                  >
                    <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-foreground -translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Geometry */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Geometry</h3>
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>

              <p className="text-sm text-muted-foreground">
                Deviation of{" "}
                <span className="text-primary font-semibold">5 μm or less</span>{" "}
                from the original 3D designs
              </p>

              <div className="rounded-xl overflow-hidden bg-accent/30 border flex-1">
                <img
                  src={qcGeometry}
                  alt="3D geometry comparison"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Other checks */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold font-display">Other checks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherChecks.map((check) => (
                <div key={check.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{check.label}</span>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl overflow-hidden border">
                    <img
                      src={check.image}
                      alt={check.label}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional details row */}
          <div className="grid grid-cols-2 gap-6 border-t pt-6">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Material</span>
              <p className="text-sm font-medium mt-1">Full Contour Zirconia</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Occlusal Staining</span>
              <p className="text-sm font-medium mt-1">Applied</p>
            </div>
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-end gap-3 border-t pt-5">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
              className="gap-1.5"
            >
              <X className="h-4 w-4" />
              Disapprove
            </Button>
            <Button onClick={onComplete} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Approve & Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
