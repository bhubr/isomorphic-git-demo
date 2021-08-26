export function genId() {
  const array = new Uint32Array(2);
  window.crypto.getRandomValues(array);

  return array.reduce((str, n) => str + n.toString(16), '');
};