import silentExec from '../shell/silentExec.js';

export default function getCommitTitles(revisionRange, dir) {
  const cmd = `git log ${revisionRange} --pretty=format:%s`;
  return silentExec(cmd, { dir, ignoreError: true }).toString().trim();
}
