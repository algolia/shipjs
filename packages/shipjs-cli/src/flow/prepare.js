import {
  getCurrentVersion,
  hasTagForCurrentVersion,
  getNextVersion,
  updateVersion,
  hasLocalBranch,
  hasRemoteBranch,
  getCurrentBranch,
  validate as orgValidate,
  exec,
} from 'shipjs-lib';
import loadConfig from '../config/loadConfig';
import { info, warning, error } from '../color';

const run = (command, dir) => {
  console.log('$', command);
  exec(command, { dir });
};

function printValidationError(result, { currentVersion, baseBranches }) {
  const messageMap = {
    working_tree_not_clean: 'The working tree is not clean.',
    current_branch_incorrect: `The current branch must be one of ${JSON.stringify(
      baseBranches
    )}`,
    no_tag_for_current_version: `There is no git tag for the current version (v${currentVersion})`,
  };

  console.log(
    error('Failed to prepare a release for the following reason(s).')
  );
  result.forEach(reason => {
    console.log(info(`  - ${messageMap[reason]}`));
  });
}

function validate({ config, dir }) {
  console.log(info('Validating...'));
  const { baseBranches } = config;
  const result = orgValidate({
    dir,
    baseBranches,
  });
  const currentVersion = getCurrentVersion(dir);
  const currentBaseBranch = getCurrentBranch(dir);
  if (result !== true) {
    printValidationError(result, { currentVersion, baseBranches });
    process.exit(1);
  }
  console.log(info('Validation passed!'));
  return { currentVersion, currentBaseBranch };
}

function pullAndGetNextVersion({ dir }) {
  run('git pull', dir);
  const nextVersion = getNextVersion(dir);
  if (nextVersion === null) {
    console.log(error('Nothing to release!'));
    process.exit(1);
  }
  return { nextVersion };
}

function prepareReleaseBranch({ config, nextVersion, dir }) {
  const { getReleaseBranchName, remote } = config;
  const releaseBranch = getReleaseBranchName({ nextVersion });
  if (hasLocalBranch(releaseBranch, dir)) {
    console.log(error(`The branch "${releaseBranch}" already exists locally.`));
    console.log('Delete the local branch and try again. For example,');
    console.log(`  $ git branch -d ${releaseBranch}`);
    process.exit(1);
  }
  if (hasRemoteBranch(remote, releaseBranch, dir)) {
    console.log(
      error(`The branch "${releaseBranch}" already exists remotely.`)
    );
    console.log('Delete the remote branch and try again. For example,');
    console.log(`  $ git push ${remote} :${releaseBranch}`);
    process.exit(1);
  }
  return { releaseBranch };
}

function updateVersions({ config, nextVersion, dir }) {
  const { packageJsons, versionUpdated } = config;
  updateVersion(packageJsons, nextVersion, dir);
  versionUpdated({ version: nextVersion, exec });
}

function updateChangelog({ config, dir }) {
  const { conventionalChangelogArgs, changelogUpdated } = config;
  run(`conventional-changelog ${conventionalChangelogArgs}`, dir);
  changelogUpdated({ exec });
}

function commitChanges({ nextVersion, dir }) {
  run('git add .', dir);
  run(`git commit -m "chore: release v${nextVersion}"`, dir);
}

function getDestinationBranchName({ currentBaseBranch, config }) {
  const { mergeReleaseBranchTo } = config;
  if (mergeReleaseBranchTo.currentBranch === true) {
    return currentBaseBranch;
  } else if (typeof mergeReleaseBranchTo.getName === 'function') {
    return mergeReleaseBranchTo.getName({ currentBranch: currentBaseBranch });
  }
}

function createPullRequest({ currentBaseBranch, config }) {
  const destinationBranch = getDestinationBranchName({
    currentBaseBranch,
    config,
  });
  // TODO: create a PR
}

function prepare(dir = '.') {
  const config = loadConfig(dir);
  const { currentVersion, currentBaseBranch } = validate({ config, dir });
  const { nextVersion } = pullAndGetNextVersion({ dir });
  const { releaseBranch } = prepareReleaseBranch({
    config,
    nextVersion,
    dir,
  });
  run(`git checkout -b ${releaseBranch}`, dir);
  updateVersions({ config, nextVersion, dir });
  updateChangelog({ config, dir });
  commitChanges({ nextVersion, dir });
  createPullRequest({ currentBaseBranch, config });
}

export default prepare;
