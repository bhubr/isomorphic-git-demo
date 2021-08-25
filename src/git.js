import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';

const { fs, pfs } = window;

const dirExists = async (dir) => {
  try {
    await window.pfs.stat(dir);
    return true;
  } catch (err) {
    return false;
  }
};

export const cloneRepo = async ({
  url, dir, accessToken, onSuccess, onFailure,
}) => {
  if (!accessToken) {
    return;
  }
  // Create target dir if it doesn't exist
  if (!(await dirExists(dir))) {
    await pfs.mkdir(dir);
  }

  try {

    // Clone repo into dir
    await git.clone({
      fs,
      http,
      url,
      dir,
      corsProxy: 'https://cors.isomorphic-git.org',
      ref: 'master',
      singleBranch: true,
      depth: 10,
      onAuth: () => ({
        username: accessToken,
        password: 'x-oauth-basic',
      }),
    });

    // List dir content
    const content = await pfs.readdir(dir);
    onSuccess(content);
  } catch (err) {
    onFailure(err);
  }
}