import silentExec from '../shell/silentExec';

export default function getRemoteOriginUrl(remote, dir) {
  const url = silentExec(`git remote get-url ${remote}`, { dir })
    .toString()
    .trim();
  return url;
}
