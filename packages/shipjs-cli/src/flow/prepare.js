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
import tempWrite from 'temp-write';
import loadConfig from '../config/loadConfig';
import { info, warning, error } from '../color';
import { resolve, basename } from 'path';
import { existsSync } from 'fs';

function run(command, dir) {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  console.log('$', info(command));
  const { code } = exec(command, { dir });
  if (code !== 0) {
    console.log(error('The following command failed:'));
    console.log(`  > ${command}`);
    process.exit(1);
  }
}

function checkHub() {
  const exists = exec('hub --version').code === 0;
  if (!exists) {
    console.log(error('You need to install `hub` first.'));
    console.log('  > https://github.com/github/hub#installation');
    process.exit(1);
  }
}

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
  const { baseBranches } = config;
  const result = orgValidate({
    dir,
    baseBranches,
  });
  const currentVersion = getCurrentVersion(dir);
  const baseBranch = getCurrentBranch(dir);
  if (result !== true) {
    printValidationError(result, { currentVersion, baseBranches });
    process.exit(1);
  }
  return { currentVersion, baseBranch };
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

function installDependencies({ config, dir }) {
  const isYarn = existsSync(resolve(dir, 'yarn.lock'));
  const command = config.installDependencies({ isYarn });
  run(command, dir);
}

function updateChangelog({ config, dir }) {
  const { conventionalChangelogArgs, changelogUpdated } = config;
  run(`conventional-changelog ${conventionalChangelogArgs}`, dir);
  changelogUpdated({ exec });
}

function commitChanges({ nextVersion, dir, config }) {
  const { formatCommitMessage } = config;
  const message = formatCommitMessage({ nextVersion });
  const filePath = tempWrite.sync(message);
  run('git add .', dir);
  run(`git commit --file=${filePath}`, dir);
}

function getDestinationBranchName({ baseBranch, config }) {
  const { mergeReleaseBranchTo } = config;
  if (mergeReleaseBranchTo.baseBranch === true) {
    return baseBranch;
  } else if (typeof mergeReleaseBranchTo.getName === 'function') {
    return mergeReleaseBranchTo.getName({ baseBranch });
  }
}

function getRepoURL({ dir }) {
  const repoName = basename(
    exec('git config --get remote.origin.url', { dir, silent: true })
      .toString()
      .trim(),
    '.git'
  );
  const repoURL = exec(`hub browse -u ${repoName}`, { dir, silent: true })
    .toString()
    .trim();
  return repoURL;
}

function createPullRequest({
  baseBranch,
  releaseBranch,
  currentVersion,
  nextVersion,
  config,
  dir,
}) {
  const { mergeReleaseBranchTo, formatPullRequestMessage } = config;
  const destinationBranch = getDestinationBranchName({
    baseBranch,
    config,
  });
  const repoURL = getRepoURL({ dir });
  const message = formatPullRequestMessage({
    repoURL,
    baseBranch,
    releaseBranch,
    destinationBranch,
    mergeReleaseBranchTo,
    currentVersion,
    nextVersion,
  });
  const filePath = tempWrite.sync(message);
  run(
    `hub pull-request --base ${destinationBranch} --browse --push --file ${filePath}`,
    dir
  );
}

function prepare(dir = '.') {
  checkHub();
  const config = loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  const { nextVersion } = pullAndGetNextVersion({ dir });
  const { releaseBranch } = prepareReleaseBranch({
    config,
    nextVersion,
    dir,
  });
  run(`git checkout -b ${releaseBranch}`, dir);
  updateVersions({ config, nextVersion, dir });
  installDependencies({ config, dir });
  updateChangelog({ config, dir });
  commitChanges({ nextVersion, dir, config });
  createPullRequest({
    baseBranch,
    releaseBranch,
    currentVersion,
    nextVersion,
    config,
    dir,
  });
}

export default prepare;
