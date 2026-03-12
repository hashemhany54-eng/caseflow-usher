import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const MOCK_USERS = [
  { email: "doctor@example.com", password: "123456", name: "Dr. Sarah Chen" },
];

const SESSION_KEY = "atomica_auth_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));

    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const user: User = { email, name };
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
