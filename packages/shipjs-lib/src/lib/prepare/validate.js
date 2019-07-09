import { BASE_BRANCH } from '../const';
import isWorkingTreeClean from '../git/isWorkingTreeClean';
import currentBranch from '../git/currentBranch';
import hasTagForCurrentVersion from '../util/hasTagForCurrentVersion';

const WORKING_TREE_NOT_CLEAN = 'working_tree_not_clean';
const CURRENT_BRANCH_INCORRECT = 'current_branch_incorrect';
const NO_TAG_FOR_CURRENT_VERSION = 'no_tag_for_current_version';

export default function validate({ dir = '.', baseBranches = [BASE_BRANCH] }) {
  const result = [];
  if (!isWorkingTreeClean(dir)) {
    result.push(WORKING_TREE_NOT_CLEAN);
  }
  if (baseBranches.indexOf(currentBranch(dir)) === -1) {
    result.push(CURRENT_BRANCH_INCORRECT);
  }
  if (!hasTagForCurrentVersion(dir)) {
    result.push(NO_TAG_FOR_CURRENT_VERSION);
  }
  return result.length === 0 ? true : result;
}
