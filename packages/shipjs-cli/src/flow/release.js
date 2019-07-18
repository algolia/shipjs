import {
  loadConfig,
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import { warning, bold, underline } from '../color';
import run from '../util/run';
import detectYarn from '../util/detectYarn';

// eslint-disable-next-line no-console
const print = console.log;
// eslint-disable-next-line no-process-exit
const exitProcess = code => process.exit(code);

function printHelp() {
  const indent = line => `\t${line}`;

  const messages = [
    bold('NAME'),
    indent('ship release - Release it.'),
    '',
    bold('USAGE'),
    indent(`ship prepare [--help] [--dir <${underline('PATH')}>]`),
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
  ];
  print(messages.join('\n'));
}

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
    print(warning('Skipping a release due to the unmet conditions.'));
    exitProcess(0);
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

function release({ help = false, dir = '.' }) {
  if (help) {
    printHelp();
    return;
  }
  const config = loadConfig(dir);
  validate({ config, dir });
  const isYarn = detectYarn(dir);
  runTest({ isYarn, config, dir });
  runBuild({ isYarn, config, dir });
  runPublish({ isYarn, config, dir });
  createGitTag({ config, dir });
  gitPush({ config, dir });
}

const arg = {
  '--dir': String,
  '--help': Boolean,

  // Aliases
  '-d': '--dir',
  '-h': '--help',
};

export default {
  arg,
  fn: release,
};
