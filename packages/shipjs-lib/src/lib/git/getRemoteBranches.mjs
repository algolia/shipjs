import silentExec from '../shell/silentExec.mjs';

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
  const origins = silentExec('git remote', { dir })
    .toString()
    .trim()
    .split('\n');
  return silentExec('git branch -r', { dir })
    .toString()
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !line.includes(' -> '))
    .map((line) => {
      const origin = origins.find((_origin) => line.startsWith(`${_origin}/`));
      return line.slice(origin.length + 1);
    })
    .filter(Boolean);
}
