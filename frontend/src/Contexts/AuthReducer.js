import {
  STAFF,
  ROLE_KEY,
  ADMIN,
  TOKEN_KEY,
  USERNAME_KEY,
  FIRST_TIME_LOGIN_KEY,
} from "../Constants/SystemConstants";

export const SET_AUTH = "SET AUTH INFORMATION";
export const CLEAR_AUTH = "CLEAR AUTH INFORMATION";

const setAuthInfo = (username, role, token, isFirstTimeLogin, state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
    username: state.username,
    isFirstTimeLogin: state.isFirstTimeLogin,
  };

  if (role === ADMIN || role === STAFF) {
    userInfo.userRole = role;
    userInfo.authenticated = true;
    userInfo.username = username;
    userInfo.isFirstTimeLogin = isFirstTimeLogin;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(FIRST_TIME_LOGIN_KEY, isFirstTimeLogin);
  }

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
    username: userInfo.username,
    isFirstTimeLogin: userInfo.isFirstTimeLogin,
  };
};

const clearAuthInfo = (state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
    username: state.username,
    isFirstTimeLogin: state.isFirstTimeLogin,
  };

  userInfo.userRole = null;
  userInfo.username = null;
  userInfo.authenticated = false;
  userInfo.isFirstTimeLogin = false;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(FIRST_TIME_LOGIN_KEY);

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
    username: userInfo.username,
    isFirstTimeLogin: userInfo.isFirstTimeLogin,
  };
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTH:
      return setAuthInfo(
        action.username,
        action.userRole,
        action.token,
        action.isFirstTimeLogin,
        state
      );

    case CLEAR_AUTH:
      return clearAuthInfo(state);

    default:
      return state;
  }
};