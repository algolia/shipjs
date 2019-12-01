import { isWorkingTreeClean, getCurrentBranch } from 'shipjs-lib';

const WORKING_TREE_NOT_CLEAN = 'workingTreeNotClean';
const CURRENT_BRANCH_INCORRECT = 'currentBranchIncorrect';

export default function validateBeforePrepare({ dir, baseBranches } = {}) {
  const result = [];
  if (!isWorkingTreeClean(dir)) {
    result.push(WORKING_TREE_NOT_CLEAN);
  }
  if (baseBranches.indexOf(getCurrentBranch(dir)) === -1) {
    result.push(CURRENT_BRANCH_INCORRECT);
  }
  return result.length === 0 ? true : result;
}
