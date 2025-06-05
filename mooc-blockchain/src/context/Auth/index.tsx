"use client";
import { IUser } from "@/interface";
import { createContext } from "react";

interface AuthContextType {
  user: IUser.BaseUser | null;
  token: string | null;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
