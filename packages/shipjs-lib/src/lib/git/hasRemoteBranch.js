import silentExec from '../shell/silentExec';

export default function hasRemoteBranch(remote, branchName, dir = '.') {
  return (
    silentExec(`git ls-remote --heads ${remote} ${branchName}`, { dir })
      .toString()
      .trim() !== ''
  );
}
