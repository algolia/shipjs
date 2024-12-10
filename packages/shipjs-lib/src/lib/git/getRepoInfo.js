import getRemoteOriginUrl from './getRemoteOriginUrl.js';
import gh from 'parse-github-url';

export default function getRepoInfo(remote, dir) {
  const remoteOriginalUrl = getRemoteOriginUrl(remote, dir);
  const { owner, name, repo, branch } = gh(remoteOriginalUrl);
  const url = `https://github.com/${repo}`;

  return {
    owner, // "algolia"
    name, // "shipjs"
    repo, // "algolia/shipjs"
    branch, // "master"
    url, // "https://github.com/algolia/shipjs"
  };
}
