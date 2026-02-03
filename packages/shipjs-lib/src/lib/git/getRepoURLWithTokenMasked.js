import getRemoteOriginUrl from './getRemoteOriginUrl.js';
import parseGitHubURL from './parseGitHubURL.js';

export default function getRepoURLWithTokenMasked(remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = parseGitHubURL(url);
  return `https://xxx@github.com/${repo}`;
}
