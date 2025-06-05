import { IAuth, IUser } from "@/interface";

interface UseAuthReturnType {
  user: IAuth.LoginProfile;
  handleLogin: (user: IUser.BaseUser) => void;
  handleLogout: () => void;
}

export type { UseAuthReturnType };
