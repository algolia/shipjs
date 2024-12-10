import silentExec from '../shell/silentExec.js';

export default function hasRemote(remote, dir = '.') {
  return (
    silentExec(`git remote get-url ${remote}`, {
      dir,
      ignoreError: true,
    }).code === 0
  );
}
