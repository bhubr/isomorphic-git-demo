import { idTypes } from '../constants';

export function generateId(type) {
  if (!idTypes.includes(type)) {
    throw new Error(`Unknown id type ${type}`);
  }
  const array = new Uint32Array(2);
  window.crypto.getRandomValues(array);

  const hex = array.reduce((str, n) => str + n.toString(16), '');
  return `${type}_${hex}`;
}

export function formatDateMonth(date) {
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  return `${mo} ${ye}`;
}
