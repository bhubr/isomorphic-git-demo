import { AUTH_LOGIN_SUCCESS, AUTH_LOGOUT, AUTH_STORAGE_KEY } from '../actions/auth';

const storedState = localStorage.getItem(AUTH_STORAGE_KEY);
const initialState = storedState ? JSON.parse(storedState) : null;

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN_SUCCESS: {
      const { token, user } = action;
      return { token, user };
    }
    case AUTH_LOGOUT: {
      return null;
    }
    default:
      return state;
  }
}