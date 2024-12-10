import silentExec from '../shell/silentExec.js';

export default function isWorkingTreeClean(dir = '.') {
  return silentExec('git status --porcelain', { dir }).toString().trim() === '';
}
