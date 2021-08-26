/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import FormEvent from './FormEvent';
import FormCustomer from './FormCustomer';
import { cloneRepo, addCommitPush } from './helpers/git';
import { readFile, writeFile } from './helpers/fs';

export default function Dashboard({ ghAccessToken, user, onLogout }) {
  const [dir] = useState('/agenda-wip4');
  const [dirContent, setDirContent] = useState([]);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    (async () => {
      await cloneRepo({
        url: 'https://github.com/bhubr/git-agenda',
        dir,
        accessToken: ghAccessToken,
        onSuccess: async (files) => {
          setDirContent(files);
          const metaJSON = await readFile(dir, 'metadata.json');
          const meta = JSON.parse(metaJSON);
          setMetadata(meta);
        },
        onFailure: (err) => console.error('clone error', err),
      });
    })();
  }, [dir, ghAccessToken]);

  const showFileContent = async (file) => {
    const content = await readFile(dir, file);
    console.log(content);
  };

  // const onAddFile = async (e) => {
  //   e.preventDefault();
  //   await window.pfs.writeFile(`${dir}/${newFileName}`, newFileContent, 'utf8');

  //   await addCommitPush({
  //     dir,
  //     filepath: newFileName,
  //     accessToken: ghAccessToken,
  //   });
  // };

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

  const genId = () => {
    const array = new Uint32Array(2);
    window.crypto.getRandomValues(array);

    return array.reduce((str, n) => str + n.toString(16), '');
  };

  const onAddCustomer = async ({ customerName }) => {
    const customers = metadata.customers ? [...metadata.customers] : [];
    const newCustomer = {
      id: genId(),
      name: customerName,
    };
    const nextCustomers = [...customers, newCustomer];
    const nextMeta = { ...metadata, customers: nextCustomers };
    const nextMetaJSON = JSON.stringify(nextMeta, null, 2);

    await writeFile(dir, 'metadata.json', nextMetaJSON);

    await addCommitPush({
      dir,
      filepath: 'metadata.json',
      accessToken: ghAccessToken,
      message: `[customer] create customer "${customerName}"`,
      author: user,
    });

    setMetadata(nextMeta);
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

      <pre>
        <code>{JSON.stringify(metadata, null, 2)}</code>
      </pre>

      <FormCustomer onSubmit={onAddCustomer} />
      <FormEvent onSubmit={onAddEvent} />
    </main>
  );
}
