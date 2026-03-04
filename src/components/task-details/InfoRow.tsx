import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  label: string;
  value?: string | boolean | null;
  icon?: LucideIcon;
}

export function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return (
    <div className="flex items-center gap-2 text-sm">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{display}</span>
    </div>
  );
}
