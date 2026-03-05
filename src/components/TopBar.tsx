import { useApp } from "@/context/AppContext";
import { StatusToggle } from "@/components/StatusToggle";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  const { user } = useApp();
  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-card px-4 gap-4">
      {/* Left: Avatar + Name + Notification + Status */}
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
        <button className="relative p-1.5 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <StatusToggle />
      </div>

      {/* Right: Search */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients, orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 bg-secondary border-0 text-sm"
        />
      </div>
    </header>
  );
}
