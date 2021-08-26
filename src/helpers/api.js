import axios from 'axios';
import { apiUrl } from '../settings';

const ownApiInstance = axios.create({
  baseURL: apiUrl,
});

const githubApiInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

export const sendCode = (code) =>
  ownApiInstance.post('/github/token', { code }).then((res) => res.data);

export const getUser = (accessToken) =>
  githubApiInstance
    .get('/user', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);
