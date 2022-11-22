import { createContext } from "react";

export const AuthContext = createContext({
  authenticated: false,
  userRole: "",
  username: "",
  setAuthInfo: (username, userRole, token) => {},
  clearAuthInfo: () => {},
});
