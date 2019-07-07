import isWorkingTreeClean from '../git/isWorkingTreeClean';
import currentBranch from '../git/currentBranch';

const WORKING_TREE_NOT_CLEAN = 'working_tree_not_clean';
const CURRENT_BRANCH_INCORRECT = 'current_branch_incorrect';

export default function validate({ baseBranch }) {
  const result = [];
  if (!isWorkingTreeClean()) {
    result.push(WORKING_TREE_NOT_CLEAN);
  }
  if (currentBranch() !== baseBranch) {
    result.push(CURRENT_BRANCH_INCORRECT);
  }
  return result.length === 0 ? true : result;
}
