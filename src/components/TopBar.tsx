import { useApp } from "@/context/AppContext";
import { StatusToggle } from "@/components/StatusToggle";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  const { user } = useApp();
  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients, orders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 bg-secondary border-0"
        />
      </div>
      <div className="flex items-center gap-4">
        <StatusToggle />
        <button className="relative p-1.5 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
