import {
  STAFF,
  ROLE_KEY,
  ADMIN,
  TOKEN_KEY,
  USERNAME_KEY,
} from "../Constants/SystemConstants";

export const SET_AUTH = "SET AUTH INFORMATION";
export const CLEAR_AUTH = "CLEAR AUTH INFORMATION";

const setAuthInfo = (username, role, token, state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
    username: state.username,
  };

  if (role === ADMIN || role === STAFF) {
    userInfo.userRole = role;
    userInfo.authenticated = true;
    userInfo.username = username;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USERNAME_KEY, username);
  }

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
    username: userInfo.username,
  };
};

const clearAuthInfo = (state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
    username: state.username,
  };

  userInfo.userRole = null;
  userInfo.username = null;
  userInfo.authenticated = false;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
    username: userInfo.username,
  };
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTH:
      return setAuthInfo(action.username, action.userRole, action.token, state);

    case CLEAR_AUTH:
      return clearAuthInfo(state);

    default:
      return state;
  }
};
