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

  const [customerName, setCustomerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [fullDay, setFullDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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
        // url: `https://bhubr:${ghAccessToken}@github.com/bhubr/git-agenda`,
        url: `https://github.com/bhubr/git-agenda`,
        ref: 'master',
        singleBranch: true,
        depth: 10,
        // oauth2format: 'github',
        // token: ghAccessToken,
        // onAuth: log('onAuth'),
        onAuth: () => ({
          username: ghAccessToken,
          password: 'x-oauth-basic',
        }),
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
    const { fs } = window;

    await git.add({ fs, dir, filepath: newFileName });
    const status = await git.status({ fs, dir, filepath: newFileName });
    console.log(status);

    let sha = await git.commit({
      fs: window.fs,
      dir,
      message: `Create ${newFileName}`,
      author: {
        name: 'Mr. Test',
        email: 'mrtest@example.com',
      },
    });

    console.log(sha);

    await git.push({
      http,
      fs,
      dir,
      onAuth: () => ({
        username: ghAccessToken,
        password: 'x-oauth-basic',
      }),
    });
  };

  const onAddEvent = async (e) => {
    e.preventDefault();
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

        <h3>New event</h3>
        <form onSubmit={onAddEvent}>
          <input
            type="text"
            name="customer"
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer name"
            value={customerName}
          />
          <input
            type="text"
            name="group"
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            value={groupName}
          />
          <input
            type="text"
            name="course"
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event name"
            value={eventName}
          />
          <input
            type="date"
            name="date"
            onChange={(e) => setEventDate(e.target.value)}
            value={eventDate}
          />
          <input
            type="checkbox"
            name="fullDay"
            checked={fullDay}
            onChange={(e) => setFullDay(e.target.checked)}
          />
          {!fullDay && (
            <>
              <input
                type="time"
                name="startTime"
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
              />
              <input
                type="time"
                name="endTime"
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
              />
            </>
          )}
          <button type="submit">new event</button>
        </form>
      </main>
    </div>
  );
}

export default App;
