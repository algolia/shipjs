import { loadConfig } from 'shipjs-lib';

import printHelp from '../step/release/printHelp.mjs';
import printDryRunBanner from '../step/printDryRunBanner.mjs';
import validate from '../step/release/validate.mjs';
import gatherRepoInfo from '../step/release/gatherRepoInfo.mjs';
import runTest from '../step/release/runTest.mjs';
import runBuild from '../step/release/runBuild.mjs';
import runBeforePublish from '../step/release/runBeforePublish.mjs';
import runPublish from '../step/release/runPublish.mjs';
import runAfterPublish from '../step/release/runAfterPublish.mjs';
import createGitTag from '../step/release/createGitTag.mjs';
import gitPush from '../step/release/gitPush.mjs';
import createGitHubRelease from '../step/release/createGitHubRelease.mjs';
import notifyReleaseSuccess from '../step/release/notifyReleaseSuccess.mjs';
import checkGitHubToken from '../step/checkGitHubToken.mjs';
import finished from '../step/release/finished.mjs';
import { detectYarn } from '../util/index.mjs';

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
