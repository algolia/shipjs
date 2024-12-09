import getRemoteOriginUrl from './getRemoteOriginUrl.mjs';
import gh from 'parse-github-url';

export default function getRepoURLWithToken(token, remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = gh(url);
  return `https://${token}@github.com/${repo}`;
}
