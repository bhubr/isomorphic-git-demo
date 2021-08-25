import React, { useState } from 'react';
import { sendCode } from './api';

export default function withAuth(WrappedComponent) {
  return () => {
    const storedGhToken = localStorage.getItem('gh:token');
    const [ghAccessToken, setGhAccessToken] = useState(storedGhToken || '');

    const setAndStoreToken = (token) => {
      localStorage.setItem('gh:token', token);
      setGhAccessToken(token);
    };

    const onCodeSuccess = (response) =>
      sendCode(response.code).then(({ access_token: token }) =>
        setAndStoreToken(token),
      );
    const onCodeFailure = (response) => console.error(response);

    const onLogout = () => {
      localStorage.removeItem('gh:token');
      setGhAccessToken('');
    };

    return (
      <WrappedComponent
        ghAccessToken={ghAccessToken}
        onLogout={onLogout}
        onCodeSuccess={onCodeSuccess}
        onCodeFailure={onCodeFailure}
      />
    );
  };
}
