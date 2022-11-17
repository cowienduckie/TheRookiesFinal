import { createContext } from "react";

export const AuthContext = createContext({
  authenticated: false,
  userRole: "",
  setAuthInfo: (userRole, token) => {},
  clearAuthInfo: () => {},
});
