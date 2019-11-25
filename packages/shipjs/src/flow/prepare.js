import { getAppName, loadConfig } from 'shipjs-lib';

import printHelp from '../step/prepare/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import checkHub from '../step/checkHub';
import validate from '../step/prepare/validate';
import validateMergeStrategy from '../step/prepare/validateMergeStrategy';
import pull from '../step/pull';
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
  checkHub();
  const config = loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  validateMergeStrategy({ config });
  const { remote } = config;
  pull({ remote, currentBranch: baseBranch, dir, dryRun });
  push({ remote, currentBranch: baseBranch, dir, dryRun });
  let { nextVersion } = getNextVersion({ currentVersion, dir });
  nextVersion = await confirmNextVersion({
    yes,
    currentVersion,
    nextVersion,
    dryRun,
  });
  const { stagingBranch } = prepareStagingBranch({
    config,
    nextVersion,
    dir,
  });
  checkoutToStagingBranch({ stagingBranch, dir, dryRun });
  const updateVersionFn = config.monorepo
    ? updateVersionMonorepo
    : updateVersion;
  await updateVersionFn({ config, nextVersion, dir, dryRun });
  installDependencies({ config, dir, dryRun });
  updateChangelog({ config, firstRelease, releaseCount, dir, dryRun });
  await commitChanges({ nextVersion, dir, config, baseBranch, dryRun });
  const { pullRequestUrl } = createPullRequest({
    baseBranch,
    stagingBranch,
    currentVersion,
    nextVersion,
    noBrowse,
    config,
    dir,
    dryRun,
  });
  const appName = getAppName(dir);
  notifyPrepared({ config, appName, version: nextVersion, pullRequestUrl });
  finished();
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
