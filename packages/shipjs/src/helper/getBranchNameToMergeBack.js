export default function getBranchNameToMergeBack({
  mergeStrategy,
  currentBranch,
}) {
  if (mergeStrategy.toSameBranch.includes(currentBranch)) {
    return currentBranch;
  } else {
    return Object.entries(mergeStrategy.toReleaseBranch).find(
      entry => entry[1] === currentBranch
    )[0];
  }
}
