import React from 'react';
import { sendCode, getUser } from './helpers/api';
import useStateStorage from './hooks/useStateStorage';

export default function withAuth(WrappedComponent) {
  return () => {
    const [ghAccessToken, setGhAccessToken] = useStateStorage('gh:token', '');
    const [user, setUser] = useStateStorage('gh:user', null);

    const onCodeSuccess = async (response) => {
      const { access_token: token } = await sendCode(response.code);
      setGhAccessToken(token);
      const { name, email } = await getUser(token);
      setUser({ name, email });
    };
    const onCodeFailure = (response) => console.error(response);

    const onLogout = () => {
      localStorage.removeItem('gh:token');
      setGhAccessToken('');
    };

    return (
      <WrappedComponent
        ghAccessToken={ghAccessToken}
        user={user}
        onLogout={onLogout}
        onCodeSuccess={onCodeSuccess}
        onCodeFailure={onCodeFailure}
      />
    );
  };
}
