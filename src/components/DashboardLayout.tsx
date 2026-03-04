import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";

export function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center border-b bg-card">
            <SidebarTrigger className="ml-2 mr-0" />
            <div className="flex-1">
              <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet context={{ searchQuery }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
