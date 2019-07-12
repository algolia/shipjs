import silentExec from '../shell/silentExec';

export default function hasLocalBranch(branchName, dir = '.') {
  return (
    silentExec(`git branch -l ${branchName}`, { dir })
      .toString()
      .trim() !== ''
  );
}
