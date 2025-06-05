import { IAuth } from "@/interface";

const AuthUtils = {
  setUser: (user: IAuth.LoginProfile) => {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },
};

export default AuthUtils;
