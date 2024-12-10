import silentExec from '../shell/silentExec.js';

export default function getRemoteOriginUrl(remote, dir) {
  const url = silentExec(`git remote get-url ${remote}`, { dir })
    .toString()
    .trim();
  return url;
}
