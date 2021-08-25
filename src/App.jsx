import React, { useState, useEffect } from 'react';
import LightningFS from '@isomorphic-git/lightning-fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import OAuth2Login from 'react-simple-oauth2-login';
import { sendCode } from './api';
import { clientId, authorizationUrl, redirectUri, scope } from './settings';

import './App.css';

window.fs = new LightningFS('fs');
window.pfs = window.fs.promises;

const dirExists = async (dir) => {
  try {
    await window.pfs.stat(dir);
    return true;
  } catch (err) {
    return false;
  }
};

const log = (label, method = 'log') => (data) => console[method](label, data)

function App() {
  const [dir] = useState('/agenda-wip');
  const [dirContent, setDirContent] = useState([]);
  const [ghAccessToken, setGhAccessToken] = useState(
    localStorage.getItem('gh:token') || '',
  );
  useEffect(() => {
    (async () => {
      if (!ghAccessToken) {
        return;
      }
      // Create target dir if it doesn't exist
      if (!(await dirExists(dir))) {
        await window.pfs.mkdir(dir);
      }

      // Clone repo into dir
      await git.clone({
        fs: window.fs,
        http,
        dir,
        corsProxy: 'https://cors.isomorphic-git.org',
        // works with a PAT
        url: `https://bhubr:${ghAccessToken}@github.com/bhubr/git-agenda`,
        ref: 'master',
        singleBranch: true,
        depth: 10,
        // oauth2format: 'github',
        // token: ghAccessToken,
        // onAuth: log('onAuth'),
        // onAuth: () => ({
        //   oauth2format: 'github',
        //   token: ghAccessToken,
        // }),
        // headers: {
        //   Authorization: `Bearer ${ghAccessToken}`
        // },
        // onAuthSuccess: log('onAuthSuccess'),
        // onAuthFailure: log('onAuthFailure', 'error'),
      });

      // List dir content
      const content = await window.pfs.readdir(dir);
      setDirContent(content);
    })();
  }, [dir, ghAccessToken]);

  const setAndStoreToken = token => {
    localStorage.setItem('gh:token', token);
    setGhAccessToken(token);
  }

  const onSuccess = (response) =>
    sendCode(response.code).then(({ access_token: token }) => setAndStoreToken(token));
  const onFailure = (response) => console.error(response);

  const onLogout = () => {
    localStorage.removeItem('gh:token');
    setGhAccessToken('');
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Isomorphic Git Demo</h1>
      </header>
      <main>
        {ghAccessToken ? (
          <>
            <span>{ghAccessToken}</span>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
          <OAuth2Login
            authorizationUrl={authorizationUrl}
            responseType="code"
            clientId={clientId}
            redirectUri={redirectUri}
            scope={scope}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
          <input onChange={(e) => setAndStoreToken(e.target.value)} />
          </>
        )}

        <ul>
          {dirContent.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
