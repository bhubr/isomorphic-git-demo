import React from 'react';
import { Switch } from 'react-router-dom';
import OAuth2Login from 'react-simple-oauth2-login';
import { clientId, authorizationUrl, redirectUri, scope } from './settings';
import LayoutRoute from './LayoutRoute';
import Dashboard from './Dashboard';
import withAuth from './withAuth';

import './App.css';


function App({ auth, onLogout, onCodeSuccess, onCodeFailure }) {
  let content;

  if (!auth) {
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
    // content = (
    //   <Dashboard
    //     onLogout={onLogout}
    //     user={auth.user}
    //     ghAccessToken={auth.token}
    //   />
    // );
    content = (
      <Switch>
        <LayoutRoute
          user={auth.user}
          ghAccessToken={auth.token}
          onLogout={onLogout}
          exact
          path="/"
          component={Dashboard}
        />
      </Switch>
    );
  }

  return <div className="App">{content}</div>;
}

export default withAuth(App);
