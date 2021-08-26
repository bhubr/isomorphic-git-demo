import React from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { clientId, authorizationUrl, redirectUri, scope } from './settings';
import Dashboard from './Dashboard';
import withAuth from './withAuth';

import './App.css';

function App({ ghAccessToken, user, onLogout, onCodeSuccess, onCodeFailure }) {
  let content;

  if (!ghAccessToken) {
    content = (
      <OAuth2Login
        authorizationUrl={authorizationUrl}
        responseType="code"
        clientId={clientId}
        redirectUri={redirectUri}
        scope={scope}
        onSuccess={onCodeSuccess}
        onFailure={onCodeFailure}
      />
    );
  } else {
    content = (
      <Dashboard
        onLogout={onLogout}
        user={user}
        ghAccessToken={ghAccessToken}
      />
    );
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default withAuth(App);
