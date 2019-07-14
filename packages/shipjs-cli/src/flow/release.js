import loadConfig from '../config/loadConfig';
import {
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib';
import { info, warning, error } from '../color';
import run from '../util/run';
import detectYarn from '../util/detectYarn';

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

function runTest({ isYarn, config, dir }) {
  const { testCommandBeforeRelease } = config;
  run(testCommandBeforeRelease({ isYarn }), dir);
}

function runBuild({ isYarn, config, dir }) {
  const { buildCommand } = config;
  run(buildCommand({ isYarn }), dir);
}

function runPublish({ isYarn, config, dir }) {
  const { publishCommand } = config;
  run(publishCommand({ isYarn }), dir);
}

function createGitTag({ config, dir }) {
  const { getTagName } = config;
  const currentVersion = getCurrentVersion(dir);
  const tagName = getTagName({ currentVersion });
  const command = `git tag ${tagName}`;
  run(command, dir);
}

function gitPush({ config, dir }) {
  const { mergeStrategy } = config;
  if (mergeStrategy.backToBaseBranch === true) {
    run('git push --tags', dir);
  } else if (mergeStrategy.toReleaseBranch === true) {
    // 1. merge back to current branch
    // 2. git push --tags
  }
}

function release(dir = '.') {
  const config = loadConfig(dir);
  validate({ config, dir });
  const isYarn = detectYarn(dir);
  runTest({ isYarn, config, dir });
  runBuild({ isYarn, config, dir });
  runPublish({ isYarn, config, dir });
  createGitTag({ config, dir });
  gitPush({ config, dir });
}

export default release;
