import { loadConfig } from 'shipjs-lib';

import checkGitHubToken from '../step/checkGitHubToken.js';
import printDryRunBanner from '../step/printDryRunBanner.js';
import createGitHubRelease from '../step/release/createGitHubRelease.js';
import createGitTag from '../step/release/createGitTag.js';
import finished from '../step/release/finished.js';
import gatherRepoInfo from '../step/release/gatherRepoInfo.js';
import getPublishTags from '../step/release/getPublishTags.js';
import gitPush from '../step/release/gitPush.js';
import notifyReleaseSuccess from '../step/release/notifyReleaseSuccess.js';
import printHelp from '../step/release/printHelp.js';
import runAfterPublish from '../step/release/runAfterPublish.js';
import runBeforePublish from '../step/release/runBeforePublish.js';
import runBuild from '../step/release/runBuild.js';
import runPublish from '../step/release/runPublish.js';
import runTest from '../step/release/runTest.js';
import validate from '../step/release/validate.js';
import validatePublishTags from '../step/release/validatePublishTags.js';
import { detectYarn } from '../util/index.js';

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
  const { appName, latestCommitHash, latestCommitUrl, repoURL, releaseTag } =
    await gatherRepoInfo({ remote, version, dir });
  const { packages, prerelease, tag, prereleaseTag } = await getPublishTags({
    config,
    version,
    releaseTag,
    dir,
  });
  validatePublishTags({ config, version, packages, tag, prereleaseTag, dir });
  const isYarn = detectYarn(dir);
  runTest({ isYarn, config, dir, dryRun });
  runBuild({ isYarn, config, version, dir, dryRun });
  await runBeforePublish({ config, dir, dryRun });
  runPublish({
    isYarn,
    config,
    releaseTag: tag,
    prereleaseTag,
    prerelease,
    dir,
    dryRun,
  });
  await runAfterPublish({
    version,
    releaseTag: tag,
    prerelease,
    config,
    dir,
    dryRun,
  });
  const { tagNames } = createGitTag({ version, config, dir, dryRun });
  gitPush({ tagNames, config, dir, dryRun });
  await createGitHubRelease({
    version,
    tag,
    prereleaseTag,
    config,
    dir,
    dryRun,
  });
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
