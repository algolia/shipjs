import {
  loadConfig,
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
  getLatestCommitHash,
  getCommitUrl,
  getAppName,
  getRepoURL,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import { warning, error, info, bold, underline } from '../color';
import print from '../util/print';
import printStep from '../util/printStep';
import exitProcess from '../util/exitProcess';
import run from '../util/run';
import detectYarn from '../util/detectYarn';
import getBranchNameToMergeBack from '../helper/getBranchNameToMergeBack';
import printDryRunBanner from '../util/printDryRunBanner';
import { notifyReleaseStart, notifyReleaseSuccess } from '../util/slack';

function printHelp() {
  const indent = line => `\t${line}`;
  const help = `--help`;
  const dir = `--dir ${underline('PATH')}`;
  const dryRun = `--dry-run`;
  const all = [help, dir, dryRun].map(x => `[${x}]`).join(' ');

  const messages = [
    bold('NAME'),
    indent('shipjs release - Release it.'),
    '',
    bold('USAGE'),
    indent(`shipjs prepare ${all}`),
    '',
    bold('OPTIONS'),
    indent(`-h, ${help}`),
    indent('  Print this help'),
    '',
    indent(`-d, ${dir}`),
    indent(
      `  Specify the ${underline(
        'PATH'
      )} of the repository (default: the current directory).`
    ),
    '',
    indent(`-D, ${dryRun}`),
    indent('  Displays the steps without actually doing them.'),
    '',
  ];
  print(messages.join('\n'));
}

function validate({ config, dir }) {
  const { mergeStrategy, shouldRelease } = config;
  const commitMessage = getLatestCommitMessage(dir);
  const currentVersion = getCurrentVersion(dir);
  const currentBranch = getCurrentBranch(dir);
  const validationResult = shouldRelease({
    commitMessage,
    currentVersion,
    currentBranch,
    mergeStrategy,
  });
  if (validationResult !== true) {
    print(warning('Skipping a release due to the following reason:'));
    print(info(`  > ${validationResult}`));
    exitProcess(0);
  }
}

function runTest({ isYarn, config, dir, dryRun }) {
  printStep('Running test');
  const { testCommandBeforeRelease } = config;
  run(testCommandBeforeRelease({ isYarn }), dir, dryRun);
}

function runBuild({ isYarn, config, dir, dryRun }) {
  printStep('Building');
  const { buildCommand } = config;
  run(buildCommand({ isYarn }), dir, dryRun);
}

function runPublish({ isYarn, config, dir, dryRun }) {
  printStep('Publishing');
  const { publishCommand } = config;
  const defaultCommand = isYarn
    ? 'yarn publish --no-git-tag-version --non-interactive'
    : 'npm publish';
  run(publishCommand({ isYarn, defaultCommand }), dir, dryRun);
}

function createGitTag({ config, dir, dryRun }) {
  printStep('Creating a git tag');
  const { getTagName } = config;
  const currentVersion = getCurrentVersion(dir);
  const tagName = getTagName({ currentVersion });
  const command = `git tag ${tagName}`;
  run(command, dir, dryRun);
  return tagName;
}

function gitPush({ tagName, config, dir, dryRun }) {
  printStep('Pushing to the remote');
  const currentBranch = getCurrentBranch(dir);
  const { mergeStrategy, remote } = config;
  const destinationBranch = getBranchNameToMergeBack({
    currentBranch,
    mergeStrategy,
  });
  const pushCommand = `git push && git push ${remote} ${tagName}`;
  if (currentBranch === destinationBranch) {
    run(pushCommand, dir, dryRun);
  } else {
    // currentBranch: 'release/legacy'
    // destinationBranch: 'legacy'
    // flow: legacy -> release/legacy -> (here) legacy
    run(`git checkout ${destinationBranch}`, dir, dryRun);
    run(`git merge ${currentBranch}`, dir, dryRun);
    run(pushCommand, dir, dryRun);
  }
}

function release({ help = false, dir = '.', dryRun = false }) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  const config = loadConfig(dir);
  validate({ config, dir });
  const appName = getAppName(dir);
  const version = getCurrentVersion(dir);
  const latestCommitHash = getLatestCommitHash(dir);
  const latestCommitUrl = getCommitUrl(latestCommitHash, dir);
  const repoURL = getRepoURL(dir);
  notifyReleaseStart({
    config,
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
  });
  const isYarn = detectYarn(dir);
  runTest({ isYarn, config, dir, dryRun });
  runBuild({ isYarn, config, dir, dryRun });
  runPublish({ isYarn, config, dir, dryRun });
  const tagName = createGitTag({ config, dir, dryRun });
  gitPush({ tagName, config, dir, dryRun });
  notifyReleaseSuccess({
    config,
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
    repoURL,
  });
  print(info('All Done.'));
}

const arg = {
  '--dir': String,
  '--help': Boolean,
  '--dry-run': Boolean,

  // Aliases
  '-d': '--dir',
  '-h': '--help',
  '-D': '--dry-run',
};

export default {
  arg,
  fn: release,
};
