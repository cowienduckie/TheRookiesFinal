import { createContext } from "react";

export const AuthContext = createContext({
  authenticated: false,
  userRole: "",
  username: "",
  isFirstTimeLogin: false,
  setAuthInfo: (username, userRole, token, isFirstTimeLogin) => {},
  clearAuthInfo: () => {},
});
