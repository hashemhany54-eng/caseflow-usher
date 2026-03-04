import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, Task, Order } from "@/types";
import { mockUser, mockTasks, mockOrders } from "@/data/mockData";

interface AppState {
  user: User;
  tasks: Task[];
  orders: Order[];
  toggleStatus: () => void;
  setStatus: (status: User["status"]) => void;
  completeTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [orders] = useState<Order[]>(mockOrders);

  const toggleStatus = useCallback(() => {
    setUser((prev) => ({ ...prev, status: prev.status === "active" ? "offline" : "active" }));
  }, []);

  const setStatus = useCallback((status: User["status"]) => {
    setUser((prev) => ({ ...prev, status }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as const } : t)));
  }, []);

  const skipTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "skipped" as const } : t)));
  }, []);

  return (
    <AppContext.Provider value={{ user, tasks, orders, toggleStatus, setStatus, completeTask, skipTask }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
