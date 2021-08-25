import React, { useState, useEffect } from 'react';
import LightningFS from '@isomorphic-git/lightning-fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
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

function App() {
  const [dir] = useState('/tutorial');
  const [dirContent, setDirContent] = useState([]);
  useEffect(() => {
    (async () => {
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
        url: 'https://github.com/bhubr/isomorphic-git-demo',
        ref: 'master',
        singleBranch: true,
        depth: 10,
      });

      // List dir content
      const content = await window.pfs.readdir(dir);
      setDirContent(content);
    })();
  }, [dir]);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Isomorphic Git Demo</h1>
        <ul>
          {dirContent.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
