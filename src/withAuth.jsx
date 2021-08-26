import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './store/actions/auth';
import useStateStorage from './hooks/useStateStorage';

export default function withAuth(WrappedComponent) {
  return () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const onCodeSuccess = async (response) => {
      dispatch(login(response.code));
    };
    const onCodeFailure = (response) => console.error(response);

    const onLogout = () => {
      dispatch(logout());
      // localStorage.removeItem('gh:token');
      // setGhAccessToken('');
    };

    return (
      <WrappedComponent
        auth={auth}
        onLogout={onLogout}
        onCodeSuccess={onCodeSuccess}
        onCodeFailure={onCodeFailure}
      />
    );
  };
}
