import silentExec from '../shell/silentExec.mjs';

export default function isWorkingTreeClean(dir = '.') {
  return silentExec('git status --porcelain', { dir }).toString().trim() === '';
}
