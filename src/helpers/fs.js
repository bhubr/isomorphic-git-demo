import LightningFS from '@isomorphic-git/lightning-fs';

window.fs = new LightningFS('fs');
window.pfs = window.fs.promises;

export async function readFile(dir, filepath) {
  const content = await window.pfs.readFile(`${dir}/${filepath}`, 'utf8');
  return content;
}

export async function writeFile(dir, filepath, content) {
  await window.pfs.writeFile(`${dir}/${filepath}`, content);
}
