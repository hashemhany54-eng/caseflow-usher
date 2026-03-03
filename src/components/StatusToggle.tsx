import { useApp } from "@/context/AppContext";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export function StatusToggle() {
  const { user, toggleStatus } = useApp();
  const isActive = user.status === "active";

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center gap-1.5">
        <motion.div
          className={`h-2 w-2 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`}
          animate={isActive ? { scale: [1, 1.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <span className="text-sm font-medium">{isActive ? "Active" : "Offline"}</span>
      </div>
      <Switch checked={isActive} onCheckedChange={toggleStatus} />
    </div>
  );
}
