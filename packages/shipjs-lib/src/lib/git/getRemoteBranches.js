import silentExec from '../shell/silentExec';

/*
$ git branch -r
  origin/HEAD -> origin/master
  origin/chore/all-contributors
  origin/master
  origin/renovate/pin-dependencies
  origin/renovate/rollup-1.x
  ...
*/

export default function getRemoteBranches(dir = '.') {
  const remote = silentExec('git remote', { dir }).toString().trim();
  return silentExec('git branch -r', { dir })
    .toString()
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.includes(' -> '))
    .map((line) => line.slice(remote.length + 1));
}
