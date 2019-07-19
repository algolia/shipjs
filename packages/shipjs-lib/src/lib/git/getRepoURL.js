import silentExec from '../shell/silentExec';
import gh from 'parse-github-url';

export default function getRepoURL({ dir }) {
  const url = silentExec('git config --get remote.origin.url', { dir })
    .toString()
    .trim();
  const { repo } = gh(url);
  return `https://github.com/${repo}`;
}
