interface LoginPayLoad {
  username: string;
  password: string;
}

interface RegisterPayLoad {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginProfile {
  userId: number;
  role: string[];
}

export type { LoginPayLoad, RegisterPayLoad, AuthTokens, LoginProfile };
