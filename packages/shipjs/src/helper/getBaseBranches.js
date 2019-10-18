export default function getBaseBranches({ mergeStrategy }) {
  const { toSameBranch, toReleaseBranch } = mergeStrategy;
  return [...toSameBranch, ...Object.keys(toReleaseBranch)];
}
