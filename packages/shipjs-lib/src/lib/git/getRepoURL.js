import { basename } from 'path';
import silentExec from '../shell/silentExec';

export default function getRepoURL({ dir }) {
  const repoName = basename(
    silentExec('git config --get remote.origin.url', { dir })
      .toString()
      .trim(),
    '.git'
  );
  const repoURL = silentExec(`hub browse -u ${repoName}`, { dir })
    .toString()
    .trim();
  return repoURL;
}
