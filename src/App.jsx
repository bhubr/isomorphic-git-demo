import React, { useState, useEffect } from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { sendCode } from './api';
import { cloneRepo, addCommitPush } from './git';
import { clientId, authorizationUrl, redirectUri, scope } from './settings';
import FormEvent from './FormEvent';

const log =
  (label, method = 'log') =>
  (data) =>
    console[method](label, data);

function App() {
  const [dir] = useState('/agenda-wip4');
  const [dirContent, setDirContent] = useState([]);
  const [ghAccessToken, setGhAccessToken] = useState(
    localStorage.getItem('gh:token') || '',
  );
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  useEffect(() => {
    (async () => {
      await cloneRepo({
        url: 'https://github.com/bhubr/git-agenda',
        dir,
        accessToken: ghAccessToken,
        onSuccess: setDirContent,
        onFailure: log('clone error', 'error'),
      });
    })();
  }, [dir, ghAccessToken]);

  const setAndStoreToken = (token) => {
    localStorage.setItem('gh:token', token);
    setGhAccessToken(token);
  };

  const onSuccess = (response) =>
    sendCode(response.code).then(({ access_token: token }) =>
      setAndStoreToken(token),
    );
  const onFailure = (response) => console.error(response);

  const onLogout = () => {
    localStorage.removeItem('gh:token');
    setGhAccessToken('');
  };

  const showFileContent = async (file) => {
    const content = await window.pfs.readFile(`${dir}/${file}`, 'utf8');
    console.log(content);
  };

  const onAddFile = async (e) => {
    e.preventDefault();
    await window.pfs.writeFile(`${dir}/${newFileName}`, newFileContent, 'utf8');

    await addCommitPush({
      dir,
      filepath: newFileName,
      accessToken: ghAccessToken,
    });
  };

  const onAddEvent = async ({
    customerName,
    groupName,
    eventName,
    eventDate,
    fullDay,
    startTime,
    endTime,
  }) => {
    const timeInterval = fullDay ? 'Full Day' : `${startTime}-${endTime}`;
    const line = `* ${customerName},${groupName},${eventName},${eventDate},${timeInterval}`;
    console.log(line);
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
            <li key={item} onClick={() => showFileContent(item)}>
              {item}
            </li>
          ))}
        </ul>

        <h3>New file</h3>
        <form onSubmit={onAddFile}>
          <input
            type="text"
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="file.txt"
          />
          <textarea
            rows="5"
            onChange={(e) => setNewFileContent(e.target.value)}
          />
          <button type="submit">new file</button>
        </form>

        <FormEvent onSubmit={onAddEvent} />
      </main>
    </div>
  );
}

export default App;
