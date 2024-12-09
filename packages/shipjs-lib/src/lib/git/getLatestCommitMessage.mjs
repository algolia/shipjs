import silentExec from '../shell/silentExec.mjs';

export default function getLatestCommitMessage(dir = '.') {
  return silentExec('git log -1 --pretty=format:%B', { dir }).toString().trim();
}
