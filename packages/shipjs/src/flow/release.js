import { loadConfig } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved

import printHelp from '../step/release/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import validate from '../step/release/validate';
import gatherRepoInfo from '../step/release/gatherRepoInfo';
import notifyReleaseStart from '../step/release/notifyReleaseStart';
import detectYarn from '../step/detectYarn';
import runTest from '../step/release/runTest';
import runBuild from '../step/release/runBuild';
import runBeforePublish from '../step/release/runBeforePublish';
import runPublish from '../step/release/runPublish';
import runAfterPublish from '../step/release/runAfterPublish';
import createGitTag from '../step/release/createGitTag';
import gitPush from '../step/release/gitPush';
import notifyReleaseSuccess from '../step/release/notifyReleaseSuccess';
import finished from '../step/finished';

async function release({ help = false, dir = '.', dryRun = false }) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  const config = loadConfig(dir);
  const { remote } = config;
  const { currentVersion: version } = validate({ config, dir });
  const {
    appName,
    latestCommitHash,
    latestCommitUrl,
    repoURL,
    releaseTag,
  } = gatherRepoInfo({ remote, version, dir });
  await notifyReleaseStart({
    config,
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
  });
  const isYarn = detectYarn({ dir });
  runTest({ isYarn, config, dir, dryRun });
  runBuild({ isYarn, config, dir, dryRun });
  await runBeforePublish({ config });
  runPublish({ isYarn, config, releaseTag, dir, dryRun });
  await runAfterPublish({ config });
  const { tagName } = createGitTag({ version, config, dir, dryRun });
  gitPush({ tagName, config, dir, dryRun });
  await notifyReleaseSuccess({
    config,
    appName,
    version,
    latestCommitHash,
    latestCommitUrl,
    repoURL,
  });
  finished();
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
