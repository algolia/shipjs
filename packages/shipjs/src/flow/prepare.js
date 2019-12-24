import { getAppName, loadConfig, getReleaseType } from 'shipjs-lib';

import printHelp from '../step/prepare/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import validate from '../step/prepare/validate';
import getRevisionRange from '../step/prepare/getRevisionRange';
import validateMergeStrategy from '../step/prepare/validateMergeStrategy';
import pull from '../step/pull';
import fetchTags from '../step/prepare/fetchTags';
import push from '../step/prepare/push';
import getNextVersion from '../step/prepare/getNextVersion';
import confirmNextVersion from '../step/prepare/confirmNextVersion';
import prepareStagingBranch from '../step/prepare/prepareStagingBranch';
import checkoutToStagingBranch from '../step/prepare/checkoutToStagingBranch';
import updateVersion from '../step/prepare/updateVersion';
import updateVersionMonorepo from '../step/prepare/updateVersionMonorepo';
import installDependencies from '../step/prepare/installDependencies';
import updateChangelog from '../step/prepare/updateChangelog';
import commitChanges from '../step/prepare/commitChanges';
import createPullRequest from '../step/prepare/createPullRequest';
import notifyPrepared from '../step/prepare/notifyPrepared';
import pushToStagingBranch from '../step/prepare/pushToStagingBranch';
import checkGitHubToken from '../step/checkGitHubToken';
import finished from '../step/finished';

import { print } from '../util';
import { warning } from '../color';

async function prepare({
  help = false,
  dir = '.',
  yes = false,
  firstRelease = false,
  releaseCount,
  dryRun = false,
  noBrowse = false,
}) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  printDeprecated({ firstRelease, releaseCount });
  checkGitHubToken({ dryRun });
  const config = loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  validateMergeStrategy({ config });
  const { remote } = config;
  pull({ remote, currentBranch: baseBranch, dir, dryRun });
  fetchTags({ dir, dryRun });
  push({ remote, currentBranch: baseBranch, dir, dryRun });
  const { revisionRange } = await getRevisionRange({ currentVersion, dir });
  let { nextVersion } = getNextVersion({ revisionRange, currentVersion, dir });
  nextVersion = await confirmNextVersion({
    yes,
    currentVersion,
    nextVersion,
    dryRun,
  });
  const releaseType = getReleaseType(currentVersion, nextVersion);
  const { stagingBranch } = prepareStagingBranch({
    config,
    nextVersion,
    releaseType,
    dir,
  });
  checkoutToStagingBranch({ stagingBranch, dir, dryRun });
  const updateVersionFn = config.monorepo
    ? updateVersionMonorepo
    : updateVersion;
  await updateVersionFn({ config, nextVersion, releaseType, dir, dryRun });
  installDependencies({ config, dir, dryRun });
  await updateChangelog({
    config,
    revisionRange,
    firstRelease,
    releaseCount,
    dir,
    dryRun,
  });
  await commitChanges({
    nextVersion,
    releaseType,
    dir,
    config,
    baseBranch,
    dryRun,
  });
  pushToStagingBranch({ remote, stagingBranch, dir, dryRun });
  const { pullRequestUrl } = await createPullRequest({
    baseBranch,
    stagingBranch,
    currentVersion,
    nextVersion,
    releaseType,
    noBrowse,
    config,
    dir,
    dryRun,
  });
  const appName = getAppName(dir);
  await notifyPrepared({
    config,
    appName,
    version: nextVersion,
    pullRequestUrl,
  });
  finished({ baseBranch, stagingBranch, pullRequestUrl, dryRun });
}

const arg = {
  '--dir': String,
  '--yes': Boolean,
  '--help': Boolean,
  '--first-release': Boolean,
  '--release-count': Number,
  '--dry-run': Boolean,
  '--no-browse': Boolean,

  // Aliases
  '-d': '--dir',
  '-y': '--yes',
  '-h': '--help',
  '-f': '--first-release',
  '-r': '--release-count',
  '-D': '--dry-run',
  '-N': '--no-browse',
};

function printDeprecated({ firstRelease, releaseCount }) {
  if (firstRelease) {
    print(warning(`DEPRECATED: --first-release, -f`));
  }
  if (releaseCount) {
    print(warning(`DEPRECATED: --release-count, -r`));
  }
}

export default {
  arg,
  fn: prepare,
};
