import silentExec from '../shell/silentExec.mjs';

export default function hasLocalBranch(branchName, dir = '.') {
  return (
    silentExec(`git show-ref --verify --quiet refs/heads/${branchName}`, {
      dir,
      ignoreError: true,
    }).code === 0
  );
}
