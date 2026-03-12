import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayout } from "@/components/DashboardLayout";
import TasksPage from "@/pages/TasksPage";
import TaskDetailsPage from "@/pages/TaskDetailsPage";
import OrdersPage from "@/pages/OrdersPage";
import OriginalOrderPage from "@/pages/OriginalOrderPage";
import CompletedPage from "@/pages/CompletedPage";
import OnHoldPage from "@/pages/OnHoldPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<AuthGuard />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<TasksPage />} />
                  <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:orderId" element={<TaskDetailsPage />} />
                  <Route path="/orders/:orderId/original" element={<OriginalOrderPage />} />
                  <Route path="/completed" element={<CompletedPage />} />
                  <Route path="/on-hold" element={<OnHoldPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
