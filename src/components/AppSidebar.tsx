import { ClipboardList, Package, CheckCircle2, PauseCircle, LogOut, Settings, Search, Users, UserCheck, Wrench, Pencil, LayoutGrid } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import logoIcon from "@/assets/logo-icon.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserStatus = "active" | "offline" | "away" | "pause" | "busy";

const statusConfig: Record<UserStatus, { label: string; dotClass: string }> = {
  active: { label: "Active", dotClass: "bg-success" },
  away: { label: "Away", dotClass: "bg-warning" },
  busy: { label: "Busy", dotClass: "bg-destructive" },
  pause: { label: "Paused", dotClass: "bg-muted-foreground" },
  offline: { label: "Offline", dotClass: "bg-muted-foreground/50" },
};

const mainNavItems = [
  { title: "Tasks", url: "/", icon: ClipboardList },
  { title: "Tickets", url: "/tickets", icon: CheckCircle2 },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Accounts", url: "/accounts", icon: LayoutGrid },
  { title: "Users", url: "/users", icon: Users },
  { title: "Design Qa", url: "/design-qa", icon: UserCheck },
  { title: "Tools", url: "/tools", icon: Wrench },
  { title: "Design Editor", url: "/design-editor", icon: Pencil },
];

const bottomNavItems = [
  { title: "Search", url: "/search", icon: Search },
  { title: "Impersonate", url: "/impersonate", icon: Users },
];

export function AppSidebar() {
  const { user, setStatus } = useApp();
  const initials = user.name.split(" ").map((n) => n[0]).join("");
  const current = statusConfig[user.status as UserStatus] || statusConfig.offline;

  return (
    <Sidebar collapsible="icon" className="!w-[var(--sidebar-width-icon)]">
      {/* Top: Logo */}
      <div className="flex h-14 items-center justify-center border-b border-sidebar-border">
        <img src={logoIcon} alt="Logo" className="w-7 h-7 opacity-70" />
      </div>

      {/* User avatar */}
      <div className="flex items-center justify-center py-3 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar-background ${current.dotClass}`}
                animate={user.status === "active" ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-40">
            {(Object.entries(statusConfig) as [UserStatus, { label: string; dotClass: string }][]).map(([key, cfg]) => (
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
      </div>

      <SidebarContent className="pt-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex flex-col items-center gap-0.5 py-2 px-1 hover:bg-sidebar-accent transition-colors h-auto"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-[9px] leading-tight text-center truncate w-full">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex-1" />

        {/* Bottom nav items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex flex-col items-center gap-0.5 py-2 px-1 hover:bg-sidebar-accent transition-colors h-auto"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="text-[9px] leading-tight text-center truncate w-full">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" className="flex flex-col items-center gap-0.5 py-2 px-1 h-auto text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="text-[9px] leading-tight">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
