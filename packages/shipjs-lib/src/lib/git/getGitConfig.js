import silentExec from '../shell/silentExec.js';

export default function getGitConfig(key, dir = '.') {
  return silentExec(`git config ${key}`, { dir, ignoreError: true })
    .toString()
    .trim();
}
