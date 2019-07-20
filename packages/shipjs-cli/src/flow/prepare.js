import {
  getCurrentVersion,
  getNextVersion as orgGetNextVersion,
  updateVersion,
  hasLocalBranch,
  hasRemoteBranch,
  getCurrentBranch,
  getRepoURL,
  validate as orgValidate,
  exec,
  loadConfig,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import tempWrite from 'temp-write';
import inquirer from 'inquirer';
import { info, warning, error, bold, underline } from '../color';
import print from '../util/print';
import exitProcess from '../util/exitProcess';
import run from '../util/run';
import detectYarn from '../util/detectYarn';
import generateChangelog from '../util/generateChangelog';

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
  const result = orgValidate({
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

function pull({ dir }) {
  print(info('# Updating from remote'));
  run('git pull', dir);
}

function getNextVersion({ dir }) {
  print(info('# Calculating the next version'));
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
  print(info('# Preparing a staging branch'));
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
  print(info('# Checking out to the staging branch'));
  run(`git checkout -b ${stagingBranch}`, dir);
}

async function updateVersions({ config, nextVersion, dir }) {
  print(info('# Updating the version'));
  const { packageJsons, versionUpdated } = config;
  updateVersion(packageJsons, nextVersion, dir);
  await versionUpdated({
    version: nextVersion,
    dir,
    exec: wrapExecWithDir(dir),
  });
}

function installDependencies({ config, dir }) {
  print(info('# Installing the dependencies'));
  const isYarn = detectYarn(dir);
  const command = config.installCommand({ isYarn });
  run(command, dir);
}

async function updateChangelog({ config, firstRelease, releaseCount, dir }) {
  print(info('# Updating the changelog'));
  const { conventionalChangelogArgs } = config;
  const options = {
    ...conventionalChangelogArgs,
    firstRelease,
    releaseCount,
  };
  await generateChangelog({ options, dir });
}

async function commitChanges({ nextVersion, dir, config }) {
  print(info('# Commiting the changes'));
  const { formatCommitMessage, beforeCommitChanges } = config;
  await beforeCommitChanges({ exec: wrapExecWithDir(dir) });
  const message = formatCommitMessage({ nextVersion });
  const filePath = tempWrite.sync(message);
  run('git add .', dir);
  run(`git commit --file=${filePath}`, dir);
}

function getDestinationBranchName({ baseBranch, config }) {
  const { mergeStrategy } = config;
  if (mergeStrategy.backToBaseBranch === true) {
    return baseBranch;
  } else if (mergeStrategy.toReleaseBranch === true) {
    return mergeStrategy.branchMappings.find(
      mapping => mapping.baseBranch === baseBranch
    ).releaseBranch;
  } else {
    throw new Error('Unknown mergeStrategy');
  }
}

function validateBeforePullRequest({
  config,
  dir,
  baseBranch,
  stagingBranch,
  destinationBranch,
}) {
  const { remote, mergeStrategy } = config;
  if (
    mergeStrategy.toReleaseBranch === true &&
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
  print(info('# Creating a pull-request'));
  const { mergeStrategy, formatPullRequestMessage, remote } = config;
  const destinationBranch = getDestinationBranchName({
    baseBranch,
    config,
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
  run(`git ${remote} prune origin`);
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
  print(info('All Done.'));
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
