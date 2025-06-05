import { LoginPayLoad, RegisterPayLoad } from "@/models";
import axiosClient from "./axios-client";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const authApi = {
  login(payload: LoginPayLoad) {
    return axiosClient
      .post("/auth/access-token", payload)
      .then((response) => {
        const { accessToken, refreshToken } = response.data;

        Cookies.set("accessToken", accessToken, { expires: 1 / 24 });

        Cookies.set("refreshToken", refreshToken, { expires: 7 });

        const decodedToken = jwtDecode(accessToken) as JwtPayload & {
          role: string | string[];
        };

        let roles: string[];
        if (typeof decodedToken.role === "string") {
          roles = [decodedToken.role];
        } else {
          roles = decodedToken.role;
        }

        if (roles.includes("ADMIN")) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/homepage";
        }

        return response;
      })
      .catch((error) => {
        console.error("Login failed:", error);
        throw error;
      });
  },
  logout() {
    localStorage.removeItem("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
  },
  register(payload: RegisterPayLoad) {
    return axiosClient.post("/auth/register", payload).then((response) => {
      if (response.status === 200) {
        alert("Vui lòng kiểm tra email để lấy mật khẩu tạm thời.");
        window.location.href = "/login";
      } else {
        throw new Error("Đăng ký không thành công");
      }
    });
  },
  refreshAccessToken() {
    const refreshToken = Cookies.get("refreshToken");
    return axiosClient
      .post("/auth/refresh-token", { refreshToken })
      .then((response) => {
        const { accessToken } = response.data;

        Cookies.set("accessToken", accessToken, { expires: 1 / 24 });

        return accessToken;
      })
      .catch((error) => {
        console.error("Refresh token failed:", error);
        return Promise.reject(error);
      });
  },
};
