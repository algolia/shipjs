import { loadConfig } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved

import printHelp from '../step/prepare/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import checkHub from '../step/checkHub';
import validate from '../step/prepare/validate';
import validateMergeStrategy from '../step/prepare/validateMergeStrategy';
import pull from '../step/pull';
import push from '../step/push';
import getNextVersion from '../step/prepare/getNextVersion';
import confirmNextVersion from '../step/prepare/confirmNextVersion';
import prepareStagingBranch from '../step/prepare/prepareStagingBranch';
import checkoutToStagingBranch from '../step/prepare/checkoutToStagingBranch';
import updateVersions from '../step/prepare/updateVersions';
import installDependencies from '../step/prepare/installDependencies';
import updateChangelog from '../step/prepare/updateChangelog';
import commitChanges from '../step/prepare/commitChanges';
import createPullRequest from '../step/prepare/createPullRequest';
import finished from '../step/finished';

async function prepare({
  help = false,
  dir = '.',
  yes = false,
  firstRelease = false,
  releaseCount,
  dryRun = false,
}) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  checkHub();
  const config = loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  validateMergeStrategy({ config });
  pull({ dir, dryRun });
  push({ dir, dryRun });
  let { nextVersion } = getNextVersion({ dir });
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
  await updateVersions({ config, nextVersion, dir, dryRun });
  installDependencies({ config, dir, dryRun });
  updateChangelog({ config, firstRelease, releaseCount, dir, dryRun });
  await commitChanges({ nextVersion, dir, config, dryRun });
  createPullRequest({
    baseBranch,
    stagingBranch,
    currentVersion,
    nextVersion,
    config,
    dir,
    dryRun,
  });
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

export default {
  arg,
  fn: prepare,
};
