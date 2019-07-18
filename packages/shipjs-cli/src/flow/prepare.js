import {
  getCurrentVersion,
  hasTagForCurrentVersion,
  getNextVersion,
  updateVersion,
  hasLocalBranch,
  hasRemoteBranch,
  getCurrentBranch,
  getRepoURL,
  validate as orgValidate,
  exec,
  loadConfig,
} from 'shipjs-lib';
import tempWrite from 'temp-write';
import inquirer from 'inquirer';
import { info, error, bold, underline } from '../color';
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
  console.log(messages.join('\n'));
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

async function confirmNextVersion({ yes, currentVersion, nextVersion }) {
  console.log(`The current version: ${currentVersion}`);
  console.log(`The next version: ${info(nextVersion)}`);
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
  const { getStagingBranchName, remote } = config;
  const stagingBranch = getStagingBranchName({ nextVersion });
  if (hasLocalBranch(stagingBranch, dir)) {
    console.log(error(`The branch "${stagingBranch}" already exists locally.`));
    console.log('Delete the local branch and try again. For example,');
    console.log(`  $ git branch -d ${stagingBranch}`);
    process.exit(1);
  }
  if (hasRemoteBranch(remote, stagingBranch, dir)) {
    console.log(
      error(`The branch "${stagingBranch}" already exists remotely.`)
    );
    console.log('Delete the remote branch and try again. For example,');
    console.log(`  $ git push ${remote} :${stagingBranch}`);
    process.exit(1);
  }
  return { stagingBranch };
}

function updateVersions({ config, nextVersion, dir }) {
  const { packageJsons, versionUpdated } = config;
  updateVersion(packageJsons, nextVersion, dir);
  versionUpdated({ version: nextVersion, exec });
}

function installDependencies({ config, dir }) {
  const isYarn = detectYarn(dir);
  const command = config.installCommand({ isYarn });
  run(command, dir);
}

async function updateChangelog({ config, firstRelease, releaseCount, dir }) {
  const { conventionalChangelogArgs, changelogUpdated } = config;
  const options = {
    ...conventionalChangelogArgs,
    firstRelease,
    releaseCount,
  };
  await generateChangelog({ options, dir });
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
  const { mergeStrategy } = config;
  if (mergeStrategy.backToBaseBranch === true) {
    return baseBranch;
  } else if (mergeStrategy.toReleaseBranch === true) {
    return mergeStrategy.getReleaseBranchName({ baseBranch });
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
  const { mergeStrategy, formatPullRequestMessage } = config;
  const destinationBranch = getDestinationBranchName({
    baseBranch,
    config,
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
  let { nextVersion } = pullAndGetNextVersion({ dir });
  nextVersion = await confirmNextVersion({ yes, currentVersion, nextVersion });
  const { stagingBranch } = prepareStagingBranch({
    config,
    nextVersion,
    dir,
  });
  run(`git checkout -b ${stagingBranch}`, dir);
  updateVersions({ config, nextVersion, dir });
  installDependencies({ config, dir });
  await updateChangelog({ config, firstRelease, releaseCount, dir });
  commitChanges({ nextVersion, dir, config });
  createPullRequest({
    baseBranch,
    stagingBranch,
    currentVersion,
    nextVersion,
    config,
    dir,
  });
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
