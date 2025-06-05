"use client";

import AuthContext from "@/context/Auth";
import AuthService from "@/services/Backend-api/auth-service";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import UserService from "@/services/Backend-api/user-service";
import { IUser } from "@/interface";
import { useRouter } from "next/navigation";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser.BaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const payload = { username, password };
      const isLoginSuccessful = await AuthService.login(payload);

      if (!isLoginSuccessful) {
        console.error("Login failed: Incorrect username or password");
        return false;
      }

      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.error("No access token received");
        return false;
      }

      try {
        const decodedToken: any = jwtDecode(accessToken);
        setToken(accessToken);

        const userResponse = await UserService.getBaseUser(decodedToken.userId);
        if (userResponse?.data) {
          setUser(userResponse.data);
          localStorage.setItem("user", JSON.stringify(userResponse.data));
        } else {
          console.error("User data not found");
          setUser(null);
        }
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        return true;
      } catch (error) {
        console.error("Failed to decode token or fetch user:", error);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleLogout = () => {
    console.log("Log out");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    Cookies.remove("accessToken");

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
