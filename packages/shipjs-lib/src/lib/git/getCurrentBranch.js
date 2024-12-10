import silentExec from '../shell/silentExec.js';

export default function getCurrentBranch(dir = '.') {
  return silentExec('git rev-parse --abbrev-ref HEAD', { dir })
    .toString()
    .trim();
}
