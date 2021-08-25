import LightningFS from '@isomorphic-git/lightning-fs';

window.fs = new LightningFS('fs');
window.pfs = window.fs.promises;
