import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import { authApi } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      console.log("AuthProvider token : ", token);

      if (token) {
        try {
          await getMe();
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            error
          );
          // Token invalide, on le supprime
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const getMe = async () => {
    const token = localStorage.getItem("auth_token");
    console.log("getMe token : ", token);
    if (token) {
      try {
        const { user } = await authApi.me();
        console.log("getMe user : ", user);
        setUser(user);
      } catch (error) {
        console.error("Erreur getMe:", error);
        // En cas d'erreur (token expiré, etc.), on nettoie
        localStorage.removeItem("auth_token");
        setUser(null);
        throw error; // On re-lance l'erreur pour que initAuth puisse la capturer
      }
    }
  };

  const login = (token: string, user: User) => {
    console.log("login : ", token);
    console.log("login : ", user);
    localStorage.setItem("auth_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
