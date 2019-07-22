import {
  getCurrentVersion,
  getNextVersion as orgGetNextVersion,
  updateVersion,
  hasLocalBranch,
  hasRemoteBranch,
  getCurrentBranch,
  getRepoURL,
  exec,
  loadConfig,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import tempWrite from 'temp-write';
import inquirer from 'inquirer';
import { info, warning, error, bold, underline } from '../color';
import print from '../util/print';
import printStep from '../util/printStep';
import exitProcess from '../util/exitProcess';
import run from '../util/run';
import detectYarn from '../util/detectYarn';
import generateChangelog from '../util/generateChangelog';
import getDestinationBranchName from '../helper/getDestinationBranchName';
import validateBeforePrepare from '../helper/validateBeforePrepare';

function printHelp() {
  const indent = line => `\t${line}`;

  const messages = [
    bold('NAME'),
    indent('ship prepare - Prepare a release.'),
    '',
    bold('USAGE'),
    indent(`ship prepare [--help] [--dir <${underline('PATH')}>] [--yes]`),
    '',
    bold('OPTIONS'),
    indent('-h, --help'),
    indent('  Print this help'),
    '',
    indent(`-d, --dir ${underline('PATH')}`),
    indent(
      `  Specify the ${underline(
        'PATH'
      )} of the repository (default: the current directory).`
    ),
    '',
    indent('-y, --yes'),
    indent('  Skip all the interactive prompts and use the default values.'),
    '',
    indent('-f, --first-release'),
    indent('  Generate the CHANGELOG for the first time'),
    '',
    indent(`-r, --release-count ${underline('COUNT')}`),
    indent('  How many releases to be generated from the latest'),
    '',
  ];
  print(messages.join('\n'));
}

function wrapExecWithDir(dir) {
  return (command, opts = {}) => {
    exec(command, {
      dir,
      ...opts,
    });
  };
}

function checkHub() {
  const exists = exec('hub --version').code === 0;
  if (!exists) {
    print(error('You need to install `hub` first.'));
    print('  > https://github.com/github/hub#installation');
    exitProcess(1);
  }
}

function printValidationError(result, { currentVersion, baseBranches }) {
  const messageMap = {
    workingTreeNotClean: 'The working tree is not clean.',
    currentBranchIncorrect: `The current branch must be one of ${JSON.stringify(
      baseBranches
    )}`,
    noTagForCurrentVersion: `There is no git tag for the current version (v${currentVersion})`,
  };

  print(error('Failed to prepare a release for the following reason(s).'));
  result.forEach(reason => {
    print(info(`  - ${messageMap[reason]}`));
  });
}

function validate({ config, dir }) {
  const { baseBranches } = config;
  const result = validateBeforePrepare({
    dir,
    baseBranches,
  });
  const currentVersion = getCurrentVersion(dir);
  const baseBranch = getCurrentBranch(dir);
  if (result !== true) {
    printValidationError(result, { currentVersion, baseBranches });
    exitProcess(1);
  }
  return { currentVersion, baseBranch };
}

function validateMergeStrategy({ config }) {
  const { mergeStrategy } = config;
  const releaseBranches = Object.values(mergeStrategy.toReleaseBranch);
  const uniqueReleaseBranches = new Set(releaseBranches);
  if (releaseBranches.length !== uniqueReleaseBranches.size) {
    print(error('Invalid `mergeStrategy` in your configuration.'));
    print(error('  : Release branch should be unique per base branch.'));
    print(warning(JSON.stringify(mergeStrategy, null, 2)));
    exitProcess(1);
  }

  const { toSameBranch } = mergeStrategy;
  if (
    new Set([...toSameBranch, ...releaseBranches]).size !==
    toSameBranch.length + releaseBranches.length
  ) {
    print(error('Invalid `mergeStrategy` in your configuration.'));
    print(
      error(
        '  : You cannot put a same branch name both in `toSameBranch` and `toReleaseBranch`'
      )
    );
  }
}

function pull({ dir }) {
  printStep('Updating from remote');
  run('git pull', dir);
}

function getNextVersion({ dir }) {
  printStep('Calculating the next version');
  const nextVersion = orgGetNextVersion(dir);
  if (nextVersion === null) {
    print(error('Nothing to release!'));
    exitProcess(1);
  }
  return { nextVersion };
}

async function confirmNextVersion({ yes, currentVersion, nextVersion }) {
  print(`The current version: ${currentVersion}`);
  print(`The next version: ${info(nextVersion)}`);
  if (yes) {
    return nextVersion;
  }
  const { correct } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'correct',
      message: 'Is this next version correct?',
      default: true,
    },
  ]);
  if (correct) {
    return nextVersion;
  } else {
    const { userTypedVersion } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userTypedVersion',
        message: 'What is the next version?',
        default: nextVersion,
      },
    ]);
    return userTypedVersion;
  }
}

function prepareStagingBranch({ config, nextVersion, dir }) {
  printStep('Preparing a staging branch');
  const { getStagingBranchName, remote } = config;
  const stagingBranch = getStagingBranchName({ nextVersion });
  if (hasLocalBranch(stagingBranch, dir)) {
    print(error(`The branch "${stagingBranch}" already exists locally.`));
    print('Delete the local branch and try again. For example,');
    print(`  $ git branch -d ${stagingBranch}`);
    exitProcess(1);
  }
  if (hasRemoteBranch(remote, stagingBranch, dir)) {
    print(error(`The branch "${stagingBranch}" already exists remotely.`));
    print('Delete the remote branch and try again. For example,');
    print(`  $ git push ${remote} :${stagingBranch}`);
    exitProcess(1);
  }
  return { stagingBranch };
}

function checkoutToStagingBranch({ stagingBranch, dir }) {
  printStep('Checking out to the staging branch');
  run(`git checkout -b ${stagingBranch}`, dir);
}

async function updateVersions({ config, nextVersion, dir }) {
  printStep('Updating the version');
  const { packageJsons, versionUpdated } = config;
  updateVersion(packageJsons, nextVersion, dir);
  await versionUpdated({
    version: nextVersion,
    dir,
    exec: wrapExecWithDir(dir),
  });
}

function installDependencies({ config, dir }) {
  printStep('Installing the dependencies');
  const isYarn = detectYarn(dir);
  const command = config.installCommand({ isYarn });
  run(command, dir);
}

async function updateChangelog({ config, firstRelease, releaseCount, dir }) {
  printStep('Updating the changelog');
  const { conventionalChangelogArgs } = config;
  const options = {
    ...conventionalChangelogArgs,
    firstRelease,
    releaseCount,
  };
  await generateChangelog({ options, dir });
}

async function commitChanges({ nextVersion, dir, config }) {
  printStep('Commiting the changes');
  const { formatCommitMessage, beforeCommitChanges } = config;
  await beforeCommitChanges({ exec: wrapExecWithDir(dir) });
  const message = formatCommitMessage({ nextVersion });
  const filePath = tempWrite.sync(message);
  run('git add .', dir);
  run(`git commit --file=${filePath}`, dir);
}

function validateBeforePullRequest({
  config,
  dir,
  baseBranch,
  stagingBranch,
  destinationBranch,
}) {
  const { remote } = config;
  if (
    baseBranch !== destinationBranch &&
    !hasRemoteBranch(remote, destinationBranch, dir)
  ) {
    print(warning('You want to release using a dedicated release branch.'));
    print(
      warning(
        `The name of the branch is \`${destinationBranch}\`, but you don't have it yet.`
      )
    );
    print(warning('Create that branch pointing to a latest stable commit.'));
    print(warning('After that, try again.'));
    print('');
    print(warning('Rolling back for now...'));
    run(`git checkout ${baseBranch}`, dir);
    run(`git branch -D ${stagingBranch}`, dir);

    exitProcess(0);
  }
}

function createPullRequest({
  baseBranch,
  stagingBranch,
  currentVersion,
  nextVersion,
  config,
  dir,
}) {
  printStep('Creating a pull-request');
  const { mergeStrategy, formatPullRequestMessage, remote } = config;
  const destinationBranch = getDestinationBranchName({
    baseBranch,
    mergeStrategy,
  });
  validateBeforePullRequest({
    config,
    dir,
    baseBranch,
    stagingBranch,
    destinationBranch,
  });
  const repoURL = getRepoURL({ dir });
  const message = formatPullRequestMessage({
    repoURL,
    baseBranch,
    stagingBranch,
    destinationBranch,
    mergeStrategy,
    currentVersion,
    nextVersion,
  });
  const filePath = tempWrite.sync(message);
  run(`git remote prune ${remote}`, dir);
  run(
    `hub pull-request --base ${destinationBranch} --browse --push --file ${filePath}`,
    dir
  );
}

async function prepare({
  help = false,
  dir = '.',
  yes = false,
  firstRelease = false,
  releaseCount,
}) {
  if (help) {
    printHelp();
    return;
  }
  checkHub();
  const config = loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  validateMergeStrategy({ config });
  pull({ dir });
  let { nextVersion } = getNextVersion({ dir });
  nextVersion = await confirmNextVersion({ yes, currentVersion, nextVersion });
  const { stagingBranch } = prepareStagingBranch({
    config,
    nextVersion,
    dir,
  });
  checkoutToStagingBranch({ stagingBranch, dir });
  await updateVersions({ config, nextVersion, dir });
  installDependencies({ config, dir });
  await updateChangelog({ config, firstRelease, releaseCount, dir });
  await commitChanges({ nextVersion, dir, config });
  createPullRequest({
    baseBranch,
    stagingBranch,
    currentVersion,
    nextVersion,
    config,
    dir,
  });
  printStep('All Done.');
}

const arg = {
  '--dir': String,
  '--yes': Boolean,
  '--help': Boolean,
  '--first-release': Boolean,
  '--release-count': Number,

  // Aliases
  '-d': '--dir',
  '-y': '--yes',
  '-h': '--help',
  '-f': '--first-release',
  '-r': '--release-count',
};

export default {
  arg,
  fn: prepare,
};
