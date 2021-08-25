import axios from 'axios';
import { apiUrl } from '../settings';

const instance = axios.create({
  baseURL: apiUrl,
});

export const sendCode = (code) =>
  instance.post('/github/token', { code }).then((res) => res.data);
