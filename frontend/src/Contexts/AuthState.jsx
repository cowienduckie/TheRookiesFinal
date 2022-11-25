import { useReducer } from "react";
import {
  STAFF,
  ADMIN,
  TOKEN_KEY,
  ROLE_KEY,
  USERNAME_KEY,
  FIRST_TIME_LOGIN_KEY
} from "../Constants/SystemConstants";
import { AuthContext } from "./AuthContext";
import { authReducer, CLEAR_AUTH, SET_AUTH } from "./AuthReducer";

export function AuthState(props) {
  const initialState = {
    authenticated: false,
    userRole: null,
    username: null,
    isFirstTimeLogin: false
  };
  const token = localStorage.getItem(TOKEN_KEY);
  const userRole = localStorage.getItem(ROLE_KEY);
  const username = localStorage.getItem(USERNAME_KEY);
  const isFirstTimeLogin = localStorage.getItem(FIRST_TIME_LOGIN_KEY);

  if (
    token &&
    userRole &&
    username &&
    isFirstTimeLogin !== null &&
    (userRole === STAFF || userRole === ADMIN)
  ) {
    initialState.authenticated = true;
    initialState.userRole = userRole;
    initialState.username = username;
    initialState.isFirstTimeLogin = (isFirstTimeLogin === "true");
  }

  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthInfo = (username, userRole, token, isFirstTimeLogin) => {
    dispatch({
      type: SET_AUTH,
      username: username,
      userRole: userRole,
      token: token,
      isFirstTimeLogin: isFirstTimeLogin
    });
  };

  const clearAuthInfo = () => {
    dispatch({ type: CLEAR_AUTH });
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: state.authenticated,
        userRole: state.userRole,
        username: state.username,
        isFirstTimeLogin: state.isFirstTimeLogin,
        setAuthInfo: setAuthInfo,
        clearAuthInfo: clearAuthInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
