import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, ArrowLeft, Download, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const pageTitles: Record<string, string> = {
  "/": "Tasks",
  "/orders": "Orders",
  "/completed": "Completed",
  "/on-hold": "On Hold",
  "/settings": "Settings",
};

const detailTabs = ["Order", "Scan", "Editor", "Design"];

const fileMenuItems = [
  "Lab Slip (aka Order form)",
  "STL",
  "3oxz",
  "CBCT Scan",
  "Design file",
  "Manufacturer Files",
  "Manufacturer Files (Rotated)",
  "Injection Mold Files",
  "Merge and Stitch Files",
  "Shade Design Files",
  "Run STL Convert",
  "Regenerate 3oxz",
  "Send to Automate",
  "Refresh Scan Images",
  "Replace .3oxz File",
  "Replace Scan STLs",
  "Upload Design File",
];

const statusOptions = ["New", "In Progress", "On Hold", "Completed", "Cancelled"];

export function TopBar({ searchQuery, onSearchChange, activeTab, onTabChange }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks } = useApp();
  const isTaskDetail = location.pathname.startsWith("/tasks/");
  const isOrderDetail = location.pathname.startsWith("/orders/");
  const pageTitle = pageTitles[location.pathname] || "Tasks";

  if (isTaskDetail || isOrderDetail) {
    const sidebarTitle = isOrderDetail ? "Your Orders" : "Your Tasks";
    return (
      <header className="flex h-full items-center bg-card">
        {/* Left section: back + title */}
        <div className="flex items-center gap-2 px-2 h-full border-r border-border shrink-0 w-64">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => navigate(isOrderDetail ? "/orders" : "/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-sm font-semibold leading-tight">{sidebarTitle}</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        {/* Tabs */}
        <div className="flex items-center h-full">
          {detailTabs.map((tab) => {
            const value = tab.toLowerCase();
            const isActive = activeTab === value;
            return (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => onTabChange(value)}
                className={cn(
                  "text-sm px-5 h-full rounded-none border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </Button>
            );
          })}
        </div>
        <div className="flex-1" />

        {/* Right action buttons */}
        <div className="flex items-center gap-1 pr-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-primary hover:text-primary">
            <Zap className="h-4 w-4" />
            Rush
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-primary hover:text-primary">
                <Download className="h-4 w-4" />
                Files
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {fileMenuItems.map((item) => (
                <DropdownMenuItem key={item} className="text-sm cursor-pointer">
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-sm text-primary hover:text-primary">
                Edit status
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {statusOptions.map((s) => (
                <DropdownMenuItem key={s} className="text-sm cursor-pointer">
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-full items-center bg-card px-4 gap-4">
      <div className="flex-1" />
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter by task"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 bg-secondary border-0 text-sm"
        />
      </div>
    </header>
  );
}
