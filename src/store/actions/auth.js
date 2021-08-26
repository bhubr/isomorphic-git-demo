import { sendCode, getUser } from '../../helpers/api';

export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

const loginSuccess = (token, user) => ({
  type: AUTH_LOGIN_SUCCESS,
  token,
  user,
})

export const login = (code) => async (dispatch) => {
      const { access_token: token } = await sendCode(code);
      const { name, email } = await getUser(token);
      dispatch(loginSuccess(token, { name, email }));
}

export const logout = () => ({
  type: AUTH_LOGOUT
})
