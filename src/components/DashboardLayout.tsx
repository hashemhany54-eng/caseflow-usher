import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";

export function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("order");
  const location = useLocation();
  const isTaskDetail = location.pathname.startsWith("/tasks/");

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex items-center h-14 border-b bg-card shrink-0">
            {!isTaskDetail && <SidebarTrigger className="ml-2 mr-0" />}
            <div className="flex-1 h-full">
              <TopBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
          {isTaskDetail ? (
            <main className="flex-1 overflow-hidden">
              <Outlet context={{ searchQuery, activeTab, setActiveTab }} />
            </main>
          ) : (
            <main className="flex-1 overflow-auto p-3 md:p-4">
              <Outlet context={{ searchQuery, activeTab, setActiveTab }} />
            </main>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
