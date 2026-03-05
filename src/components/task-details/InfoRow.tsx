import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  label: string;
  value?: string | boolean | null;
  icon?: LucideIcon;
}

export function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? value ? "Yes" : "No" : value;
  return (
    <div className="flex items-start gap-1.5 text-sm min-w-0">
      <span className="text-muted-foreground shrink-0 whitespace-nowrap">{label}:</span>
      <span className="font-medium break-words min-w-0">{display}</span>
    </div>);

}