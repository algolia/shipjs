import loadConfig from '../config/loadConfig';
import {
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib';
import { info, warning, error } from '../color';

function validate({ config, dir }) {
  const { mergeStrategy, shouldRelease } = config;
  const commitMessage = getLatestCommitMessage(dir);
  const currentVersion = getCurrentVersion(dir);
  const currentBranch = getCurrentBranch(dir);
  if (
    !shouldRelease({
      commitMessage,
      currentVersion,
      currentBranch,
      mergeStrategy,
    })
  ) {
    console.log(warning('Skipping a release due to the unmet conditions.'));
    process.exit(0);
  }
}

function runTest({ config, dir }) {
  const { testCommandBeforeRelease } = config;
}

function release(dir = '.') {
  const config = loadConfig(dir);
  validate({ config, dir });
  runTest({ config, dir });
}

export default release;
