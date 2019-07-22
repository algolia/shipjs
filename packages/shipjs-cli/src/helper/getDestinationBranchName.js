export default function getDestinationBranchName({
  baseBranch,
  mergeStrategy,
}) {
  const { toSameBranch, toReleaseBranch } = mergeStrategy;
  if (toSameBranch.includes(baseBranch)) {
    return baseBranch;
  }
  if (toReleaseBranch[baseBranch]) {
    return toReleaseBranch[baseBranch];
  }
  throw new Error('Unknown mergeStrategy');
}
