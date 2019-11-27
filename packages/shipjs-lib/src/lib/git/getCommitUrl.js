import getRepoInfo from './getRepoInfo';

export default function getCommitUrl(remote, hash, dir = '.') {
  const { url: repoURL } = getRepoInfo(remote, dir);
  return `${repoURL}/commit/${hash}`;
}
