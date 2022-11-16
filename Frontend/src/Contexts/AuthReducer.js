import {
  NORMAL_USER,
  ROLE_KEY,
  SUPER_USER,
  TOKEN_KEY,
} from "../Constants/SystemConstants";

export const SET_AUTH = "SET AUTH INFORMATION";
export const CLEAR_AUTH = "CLEAR AUTH INFORMATION";

const setAuthInfo = (role, token, state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
  };

  if (role === SUPER_USER || role === NORMAL_USER) {
    userInfo.userRole = role;
    userInfo.authenticated = true;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  }

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
  };
};

const clearAuthInfo = (state) => {
  const userInfo = {
    userRole: state.userRole,
    authenticated: state.authenticated,
  };

  userInfo.userRole = null;
  userInfo.authenticated = false;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);

  return {
    ...state,
    userRole: userInfo.userRole,
    authenticated: userInfo.authenticated,
  };
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTH:
      return setAuthInfo(action.userRole, action.token, state);

    case CLEAR_AUTH:
      return clearAuthInfo(state);

    default:
      return state;
  }
};
