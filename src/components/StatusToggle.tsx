import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Circle } from "lucide-react";

type UserStatus = "active" | "offline" | "away" | "pause" | "busy";

const statusConfig: Record<UserStatus, { label: string; color: string; dotClass: string }> = {
  active: { label: "Active", color: "text-success", dotClass: "bg-success" },
  away: { label: "Away", color: "text-warning", dotClass: "bg-warning" },
  busy: { label: "Busy", color: "text-destructive", dotClass: "bg-destructive" },
  pause: { label: "Paused", color: "text-muted-foreground", dotClass: "bg-muted-foreground" },
  offline: { label: "Offline", color: "text-muted-foreground", dotClass: "bg-muted-foreground/50" },
};

export function StatusToggle() {
  const { user, setStatus } = useApp();
  const current = statusConfig[user.status as UserStatus] || statusConfig.offline;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 px-3 text-xs font-medium">
          <motion.div
            className={`h-2 w-2 rounded-full ${current.dotClass}`}
            animate={user.status === "active" ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          {current.label}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(Object.entries(statusConfig) as [UserStatus, typeof current][]).map(([key, cfg]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setStatus(key)}
            className="gap-2 text-xs cursor-pointer"
          >
            <div className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
            {cfg.label}
            {user.status === key && <span className="ml-auto text-[10px] text-muted-foreground">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
