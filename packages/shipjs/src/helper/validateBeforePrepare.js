import { isWorkingTreeClean, getCurrentBranch, hasTag } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved

const WORKING_TREE_NOT_CLEAN = 'workingTreeNotClean';
const CURRENT_BRANCH_INCORRECT = 'currentBranchIncorrect';
const NO_TAG_FOR_CURRENT_VERSION = 'noTagForCurrentVersion';

export default function validateBeforePrepare({
  dir,
  currentTagName,
  baseBranches,
} = {}) {
  const result = [];
  if (!isWorkingTreeClean(dir)) {
    result.push(WORKING_TREE_NOT_CLEAN);
  }
  if (baseBranches.indexOf(getCurrentBranch(dir)) === -1) {
    result.push(CURRENT_BRANCH_INCORRECT);
  }
  if (!hasTag(currentTagName, dir)) {
    result.push(NO_TAG_FOR_CURRENT_VERSION);
  }
  return result.length === 0 ? true : result;
}
