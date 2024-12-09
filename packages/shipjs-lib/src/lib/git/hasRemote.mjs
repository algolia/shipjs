import silentExec from '../shell/silentExec.mjs';

export default function hasRemote(remote, dir = '.') {
  return (
    silentExec(`git remote get-url ${remote}`, {
      dir,
      ignoreError: true,
    }).code === 0
  );
}
