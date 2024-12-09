import silentExec from '../shell/silentExec.mjs';

export default function getGitConfig(key, dir = '.') {
  return silentExec(`git config ${key}`, { dir, ignoreError: true })
    .toString()
    .trim();
}
