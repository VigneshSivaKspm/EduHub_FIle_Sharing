import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "student";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  batchId?: string; // Batch enrollment for students
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (
    email: string,
    password: string,
    role: UserRole,
  ): Promise<boolean> => {
    // Mock authentication
    if (password === "password") {
      const mockUser: User = {
        id: role === "admin" ? "admin-1" : "student-1",
        email,
        name: role === "admin" ? "Admin User" : "John Doe",
        role,
        studentId: role === "student" ? "STU2024001" : undefined,
        batchId: role === "student" ? "1" : undefined, // Morning Batch
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
