import { sendCode, getUser } from '../../helpers/api';

export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const AUTH_STORAGE_KEY = 'gh:auth';

const loginSuccessAction = (token, user) => ({
  type: AUTH_LOGIN_SUCCESS,
  token,
  user,
});

export const login = (code) => async (dispatch) => {
  const { access_token: token } = await sendCode(code);
  const { name, email } = await getUser(token);
  const user = { name, email };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
  dispatch(loginSuccessAction(token, user));
};

export const logoutAction = () => ({
  type: AUTH_LOGOUT,
});

export const logout = () => (dispatch) => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  dispatch(logoutAction());
};
