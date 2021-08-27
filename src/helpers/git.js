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

/**
 * Clone a repository to a local dir
 *
 * @param {*} param0
 * @returns
 */
export const cloneRepo = async ({
  url,
  dir,
  accessToken,
  onSuccess,
  onFailure,
}) => {
  // Exit if no access token
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
      corsProxy: 'https://git-cors-proxy.benoithubert.me',
      // corsProxy: 'https://cors.isomorphic-git.org',
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
};

/**
 * Add only
 */
export const add = async ({ dir, filepath }) => {
  await git.add({ fs, dir, filepath });
};

/**
 * Add, commit & push a file
 */
export const addCommitPush = async ({
  dir,
  filepath,
  accessToken,
  message,
  author,
}) => {
  await git.add({ fs, dir, filepath });
  // const status = await git.status({ fs, dir, filepath });
  // console.log(status);

  await git.commit({
    fs: window.fs,
    dir,
    message,
    author,
  });

  await git.push({
    http,
    fs,
    dir,
    onAuth: () => ({
      username: accessToken,
      password: 'x-oauth-basic',
    }),
  });
};
