import gh from 'parse-github-url';

import getRemoteOriginUrl from './getRemoteOriginUrl.js';

export default function getRepoURLWithTokenMasked(remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = gh(url);
  return `https://xxx@github.com/${repo}`;
}
