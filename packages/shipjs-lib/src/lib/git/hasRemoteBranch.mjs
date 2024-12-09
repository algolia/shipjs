import silentExec from '../shell/silentExec.mjs';

export default function hasRemoteBranch(remote, branchName, dir = '.') {
  return (
    silentExec(`git ls-remote --heads ${remote} ${branchName}`, { dir })
      .toString()
      .trim() !== ''
  );
}
