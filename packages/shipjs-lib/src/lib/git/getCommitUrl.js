import getRepoURL from './getRepoURL';

export default function getCommitUrl(hash, dir = '.') {
  const repoURL = getRepoURL(dir);
  return `${repoURL}/commit/${hash}`;
}
