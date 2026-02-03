import gh from 'parse-github-url';

import getRemoteOriginUrl from './getRemoteOriginUrl.js';

export default function getRepoURLWithToken(token, remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = gh(url);
  return `https://${token}@github.com/${repo}`;
}
