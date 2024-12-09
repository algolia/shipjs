import getRemoteOriginUrl from './getRemoteOriginUrl.mjs';
import gh from 'parse-github-url';

export default function getRepoURLWithTokenMasked(remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = gh(url);
  return `https://xxx@github.com/${repo}`;
}
