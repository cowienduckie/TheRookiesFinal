import { useReducer } from "react";
import {
  NORMAL_USER,
  SUPER_USER,
  TOKEN_KEY,
  ROLE_KEY,
} from "../Constants/SystemConstants";
import { AuthContext } from "./AuthContext";
import { authReducer, CLEAR_AUTH, SET_AUTH } from "./AuthReducer";

export function AuthState(props) {
  const initialState = {
    authenticated: false,
    userRole: null,
  };
  const token = localStorage.getItem(TOKEN_KEY);
  const userRole = localStorage.getItem(ROLE_KEY);

  if (
    token &&
    userRole &&
    (userRole === NORMAL_USER || userRole === SUPER_USER)
  ) {
    initialState.authenticated = true;
    initialState.userRole = userRole;
  }

  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthInfo = (userRole, token) => {
    dispatch({ type: SET_AUTH, userRole: userRole, token: token });
  };

  const clearAuthInfo = () => {
    dispatch({ type: CLEAR_AUTH });
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: state.authenticated,
        userRole: state.userRole,
        setAuthInfo: setAuthInfo,
        clearAuthInfo: clearAuthInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
