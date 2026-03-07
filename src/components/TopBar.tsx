import { useLocation, useNavigate } from "react-router-dom";
import { Search, RefreshCw, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

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

export function TopBar({ searchQuery, onSearchChange, activeTab, onTabChange }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks } = useApp();
  const isTaskDetail = location.pathname.startsWith("/tasks/");
  const pageTitle = pageTitles[location.pathname] || "Tasks";

  if (isTaskDetail) {
    return (
      <header className="flex h-full items-center bg-card">
        {/* Left section: back + title */}
        <div className="flex items-center gap-2 px-3 h-full border-r border-border shrink-0 w-64">
          <button
            onClick={() => navigate("/")}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold leading-tight">Your Tasks</h2>
            
          </div>
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-auto shrink-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex items-center h-full">
          {detailTabs.map((tab) => {
            const value = tab.toLowerCase();
            const isActive = activeTab === value;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(value)}
                className={`text-sm px-5 h-full border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
      </header>
    );
  }

  return (
    <header className="flex h-full items-center bg-card px-4 gap-4">
      <div>
        <h1 className="text-base font-bold leading-tight text-foreground">{pageTitle}</h1>
        
      </div>
      <div className="flex-1" />
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
