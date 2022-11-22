import { getAppName, loadConfig, getReleaseType } from 'shipjs-lib';

import printHelp from '../step/prepare/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import validate from '../step/prepare/validate';
import getRevisionRange from '../step/prepare/getRevisionRange';
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
import validatePreparationConditions from '../step/prepare/validatePreparationConditions';
import checkGitHubToken from '../step/checkGitHubToken';
import finished from '../step/prepare/finished';

import { arrayify, print, wrapExecWithDir } from '../util';
import { warning } from '../color';

async function prepare({
  help = false,
  dir = '.',
  yes = false,
  firstRelease = false,
  releaseCount,
  dryRun = false,
  noBrowse = false,
  commitFrom,
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
  const config = await loadConfig(dir);
  const { currentVersion, baseBranch } = validate({ config, dir });
  const { remote, forcePushBranches, version } = config;

  const currentTag = arrayify(
    config.getTagName({ version: currentVersion })
  )[0];
  let nextVersion;
  let releaseType;

  if (version) {
    ({ nextVersion } = await version({
      exec: wrapExecWithDir(dir),
    }));
    releaseType = getReleaseType(nextVersion);
  } else {
    pull({ remote, currentBranch: baseBranch, dir, dryRun });
    fetchTags({ dir, dryRun });
    push({ remote, currentBranch: baseBranch, forcePushBranches, dir, dryRun });
    const { revisionRange } = await getRevisionRange({
      yes,
      commitFrom,
      currentTag,
      dir,
    });
    ({ nextVersion } = getNextVersion({
      config,
      revisionRange,
      currentVersion,
      dir,
    }));
    nextVersion = await confirmNextVersion({
      yes,
      currentVersion,
      nextVersion,
      dryRun,
    });
    releaseType = getReleaseType(nextVersion);
    await validatePreparationConditions({
      config,
      releaseType,
      nextVersion,
      revisionRange,
      dir,
      dryRun,
    });

    const updateVersionFn = config.monorepo
      ? updateVersionMonorepo
      : updateVersion;
    await updateVersionFn({ config, nextVersion, releaseType, dir, dryRun });
    installDependencies({ config, dir, dryRun });
    await updateChangelog({
      config,
      revisionRange,
      firstRelease,
      nextVersion,
      releaseCount,
      dir,
      dryRun,
    });
  }

  const { stagingBranch } = prepareStagingBranch({
    config,
    nextVersion,
    releaseType,
    dir,
  });
  checkoutToStagingBranch({ stagingBranch, dir, dryRun });
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
    currentTag,
    nextVersion,
    releaseType,
    noBrowse,
    config,
    dir,
    dryRun,
  });
  const appName = await getAppName(dir);
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
  '--commit-from': String,

  // Aliases
  '-d': '--dir',
  '-y': '--yes',
  '-h': '--help',
  '-f': '--first-release',
  '-r': '--release-count',
  '-D': '--dry-run',
  '-N': '--no-browse',
  '-c': '--commit-from',
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
