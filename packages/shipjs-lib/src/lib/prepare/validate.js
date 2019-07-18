import { BASE_BRANCH } from '../const';
import isWorkingTreeClean from '../git/isWorkingTreeClean';
import getCurrentBranch from '../git/getCurrentBranch';
import hasTagForCurrentVersion from '../util/hasTagForCurrentVersion';

const WORKING_TREE_NOT_CLEAN = 'workingTreeNotClean';
const CURRENT_BRANCH_INCORRECT = 'currentBranchIncorrect';
const NO_TAG_FOR_CURRENT_VERSION = 'noTagForCurrentVersion';

export default function validate({
  dir = '.',
  baseBranches = [BASE_BRANCH],
} = {}) {
  const result = [];
  if (!isWorkingTreeClean(dir)) {
    result.push(WORKING_TREE_NOT_CLEAN);
  }
  if (baseBranches.indexOf(getCurrentBranch(dir)) === -1) {
    result.push(CURRENT_BRANCH_INCORRECT);
  }
  if (!hasTagForCurrentVersion(dir)) {
    result.push(NO_TAG_FOR_CURRENT_VERSION);
  }
  return result.length === 0 ? true : result;
}
