import { loadConfig } from 'shipjs-lib';

import printHelp from '../step/release/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import validate from '../step/release/validate';
import gatherRepoInfo from '../step/release/gatherRepoInfo';
import runTest from '../step/release/runTest';
import runBuild from '../step/release/runBuild';
import runBeforePublish from '../step/release/runBeforePublish';
import runPublish from '../step/release/runPublish';
import runAfterPublish from '../step/release/runAfterPublish';
import createGitTag from '../step/release/createGitTag';
import gitPush from '../step/release/gitPush';
import createGitHubRelease from '../step/release/createGitHubRelease';
import notifyReleaseSuccess from '../step/release/notifyReleaseSuccess';
import checkGitHubToken from '../step/checkGitHubToken';
import finished from '../step/release/finished';
import { detectYarn } from '../util';

async function release({ help = false, dir = '.', dryRun = false }) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  checkGitHubToken({ dryRun });
  const config = await loadConfig(dir);
  const { remote } = config;
  const { currentVersion: version } = validate({ config, dir });
  const {
    appName,
    latestCommitHash,
    latestCommitUrl,
    repoURL,
    releaseTag,
  } = await gatherRepoInfo({ remote, version, dir });
  const isYarn = detectYarn(dir);
  runTest({ isYarn, config, dir, dryRun });
  runBuild({ isYarn, config, version, dir, dryRun });
  await runBeforePublish({ config, dir, dryRun });
  runPublish({ isYarn, config, releaseTag, dir, dryRun });
  await runAfterPublish({ version, releaseTag, config, dir, dryRun });
  const { tagNames } = createGitTag({ version, config, dir, dryRun });
  gitPush({ tagNames, config, dir, dryRun });
  await createGitHubRelease({ version, config, dir, dryRun });
  await notifyReleaseSuccess({
    config,
    appName,
    version,
    tagNames,
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
