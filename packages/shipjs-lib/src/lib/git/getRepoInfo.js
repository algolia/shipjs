import getRemoteOriginUrl from './getRemoteOriginUrl.js';
import parseGitHubURL from './parseGitHubURL.js';

export default function getRepoInfo(remote, dir) {
  const remoteOriginalUrl = getRemoteOriginUrl(remote, dir);
  const { owner, name, repo, branch } = parseGitHubURL(remoteOriginalUrl);
  const url = `https://github.com/${repo}`;

  return {
    owner, // "algolia"
    name, // "shipjs"
    repo, // "algolia/shipjs"
    branch, // "master"
    url, // "https://github.com/algolia/shipjs"
  };
}
