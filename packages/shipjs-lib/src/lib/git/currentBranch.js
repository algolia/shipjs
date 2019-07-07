import silentExec from '../shell/silentExec';

export default function currentBranch(dir = '.') {
  return silentExec('git rev-parse --abbrev-ref HEAD', { dir })
    .toString()
    .trim();
}
