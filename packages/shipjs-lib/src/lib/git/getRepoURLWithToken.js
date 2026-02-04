import getRemoteOriginUrl from './getRemoteOriginUrl.js';
import parseGitHubURL from './parseGitHubURL.js';

export default function getRepoURLWithToken(token, remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = parseGitHubURL(url);
  return `https://${token}@github.com/${repo}`;
}
