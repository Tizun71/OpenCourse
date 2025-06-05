import { IAuth } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client";
import Cookies from "js-cookie";

const AuthService = {
  login: async (payload: IAuth.LoginPayLoad): Promise<boolean | unknown> => {
    try {
      const response = await axiosClient.post("/auth/access-token", payload);
      const tokens = response.data;

      const tokenKey: IAuth.AuthTokens = {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };

      Cookies.set("accessToken", tokenKey.accessToken, { expires: 1 / 24 });
      Cookies.set("refreshToken", tokenKey.refreshToken, { expires: 7 });

      return true;
    } catch (err) {
      throw err;
    }
  },

  register: async (
    payload: IAuth.RegisterPayLoad
  ): Promise<boolean | unknown> => {
    try {
      const res = await axiosClient.post("/auth/register", payload);

      const response = res.data;
      if (response.status === 400) {
        throw new Error(response.message);
      }
      return true;
    } catch (err) {
      throw err;
    }
  },
};

export default AuthService;
