import silentExec from '../shell/silentExec.js';

export default function hasRemoteBranch(remote, branchName, dir = '.') {
  return (
    silentExec(`git ls-remote --heads ${remote} ${branchName}`, { dir })
      .toString()
      .trim() !== ''
  );
}
