import silentExec from '../shell/silentExec.js';

export default function getLatestCommitHash(dir = '.') {
  return silentExec('git log -1 --pretty=format:%h', { dir }).toString().trim();
}
