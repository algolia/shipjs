import loadConfig from '../config/loadConfig';
import {
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib';
import { info, warning, error } from '../color';

function validate({ config }) {
  const { mergeReleaseBranchTo, shouldRelease } = config;
  const commitMessage = getLatestCommitMessage(dir);
  const currentVersion = getCurrentVersion(dir);
  const currentBranch = getCurrentBranch(dir);
  if (
    !shouldRelease({
      commitMessage,
      currentVersion,
      currentBranch,
      mergeReleaseBranchTo,
    })
  ) {
    console.log(warning('Skipping a release due to the unmet conditions.'));
    process.exit(0);
  }
}

function release(dir = '.') {
  const config = loadConfig(dir);
  validate({ config });
}

export default release;
