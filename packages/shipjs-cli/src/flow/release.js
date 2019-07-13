import loadConfig from '../config/loadConfig';
import { getCurrentVersion, getCurrentBranch } from 'shipjs-lib';

function validate({ config }) {
  const { mergeReleaseBranchTo, shouldRelease } = config;
  const commitMessage;
  const currentVersion = getCurrentVersion(dir);
  const currentBranch = getCurrentBranch(dir);
}

function release(dir = '.') {
  const config = loadConfig(dir);
  validate({ config });
}

export default release;
