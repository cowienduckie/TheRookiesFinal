import { useReducer } from 'react'
import {
  STAFF,
  ADMIN,
  TOKEN_KEY,
  ROLE_KEY,
  USERNAME_KEY,
} from '../Constants/SystemConstants'
import { AuthContext } from './AuthContext'
import { authReducer, CLEAR_AUTH, SET_AUTH } from './AuthReducer'

export function AuthState(props) {
  const initialState = {
    authenticated: false,
    userRole: null,
    username: null,
  }
  const token = localStorage.getItem(TOKEN_KEY)
  const userRole = localStorage.getItem(ROLE_KEY)
  const username = localStorage.getItem(USERNAME_KEY)

  if (
    token &&
    userRole &&
    username &&
    (userRole === STAFF || userRole === ADMIN)
  ) {
    initialState.authenticated = true
    initialState.userRole = userRole
    initialState.username = username
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  const setAuthInfo = (username, userRole, token) => {
    dispatch({
      type: SET_AUTH,
      username: username,
      userRole: userRole,
      token: token,
    })
  }

  const clearAuthInfo = () => {
    dispatch({ type: CLEAR_AUTH })
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated: state.authenticated,
        userRole: state.userRole,
        username: state.username,
        setAuthInfo: setAuthInfo,
        clearAuthInfo: clearAuthInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
