/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import FormEvent from './FormEvent';
import FormCustomer from './FormCustomer';
import { cloneRepo, addCommitPush } from './git';

export default function Dashboard({ ghAccessToken, onLogout }) {
  const [dir] = useState('/agenda-wip4');
  const [dirContent, setDirContent] = useState([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  useEffect(() => {
    (async () => {
      console.log('effect', ghAccessToken);
      await cloneRepo({
        url: 'https://github.com/bhubr/git-agenda',
        dir,
        accessToken: ghAccessToken,
        onSuccess: setDirContent,
        onFailure: (err) => console.error('clone error', err),
      });
    })();
  }, [dir, ghAccessToken]);

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

  const onAddCustomer = async ({ customerName }) => {
    console.log(customerName);
  };
  return (
    <main>
      <nav>
        <span>{ghAccessToken}</span>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>

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

      <FormCustomer onSubmit={onAddCustomer} />
      <FormEvent onSubmit={onAddEvent} />
    </main>
  );
}
