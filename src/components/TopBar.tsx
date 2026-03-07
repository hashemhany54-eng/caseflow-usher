import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const pageTitles: Record<string, string> = {
  "/": "Your Tasks",
  "/orders": "Orders",
  "/completed": "Completed",
  "/on-hold": "On Hold",
  "/settings": "Settings",
};

export function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isTaskDetail = location.pathname.startsWith("/tasks/");
  const pageTitle = pageTitles[location.pathname] || "Your Tasks";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center bg-card px-4 gap-4">
      {isTaskDetail ? (
        <>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className="text-sm font-medium text-foreground">Your Tasks</span>
          <div className="flex items-center gap-0 ml-2">
            {["Order", "Scan", "Editor", "Design"].map((tab) => (
              <button
                key={tab}
                className="text-sm px-4 h-14 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors data-[active=true]:border-primary data-[active=true]:text-foreground"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1" />
        </>
      ) : (
        <>
          <span className="text-sm font-medium text-foreground">{pageTitle}</span>
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
        </>
      )}
    </header>
  );
}
