import getRepoURL from './getRepoURL';

export default function getCommitUrl(remote, hash, dir = '.') {
  const repoURL = getRepoURL(remote, dir);
  return `${repoURL}/commit/${hash}`;
}
