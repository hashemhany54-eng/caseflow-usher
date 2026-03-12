import { ClipboardList, Package, CheckCircle2, PauseCircle, LogOut, Settings, ChevronsUpDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import logo from "@/assets/logo.svg";
import logoIcon from "@/assets/logo-icon.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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

const navItems = [
  { title: "Tasks", url: "/", icon: ClipboardList },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, setStatus } = useApp();
  const navigate = useNavigate();
  const initials = user.name.split(" ").map((n) => n[0]).join("");
  const current = statusConfig[user.status as UserStatus] || statusConfig.offline;

  return (
    <Sidebar collapsible="icon">
      {/* Top: User avatar + name with status dropdown */}
      <div className={`flex h-14 items-center px-3 border-b border-sidebar-border ${collapsed ? 'justify-center' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-2.5 hover:bg-sidebar-accent rounded-md px-1.5 py-1.5 transition-colors ${collapsed ? 'justify-center' : 'w-full'}`}>
              <div className="relative shrink-0">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar-background ${current.dotClass}`}
                  animate={user.status === "active" ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              {!collapsed && (
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</span>
                    <span className="text-[10px] text-sidebar-foreground/60">{current.label}</span>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-sidebar-foreground/40 shrink-0 ml-auto" />
                </div>
              )}
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

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider delayDuration={0}>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            end={item.url === "/"}
                            className="hover:bg-sidebar-accent transition-colors"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="ml-2">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="ml-2">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-0">
        <div className="h-[60px] flex items-center justify-center">
          {collapsed ? (
            <img src={logoIcon} alt="3Sixty" className="w-14 opacity-50" />
          ) : (
            <img src={logo} alt="3Sixty Aligners" className="h-3.5 opacity-40" />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
