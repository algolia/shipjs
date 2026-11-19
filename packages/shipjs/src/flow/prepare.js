import { getAppName, loadConfig, getReleaseType } from 'shipjs-lib';

import { error, warning } from '../color.js';
import checkGitHubToken from '../step/checkGitHubToken.js';
import checkoutToStagingBranch from '../step/prepare/checkoutToStagingBranch.js';
import commitChanges from '../step/prepare/commitChanges.js';
import confirmNextVersion from '../step/prepare/confirmNextVersion.js';
import createPullRequest from '../step/prepare/createPullRequest.js';
import fetchTags from '../step/prepare/fetchTags.js';
import finished from '../step/prepare/finished.js';
import getNextVersion from '../step/prepare/getNextVersion.js';
import getRevisionRange from '../step/prepare/getRevisionRange.js';
import installDependencies from '../step/prepare/installDependencies.js';
import notifyPrepared from '../step/prepare/notifyPrepared.js';
import prepareStagingBranch from '../step/prepare/prepareStagingBranch.js';
import printHelp from '../step/prepare/printHelp.js';
import push from '../step/prepare/push.js';
import pushToStagingBranch from '../step/prepare/pushToStagingBranch.js';
import updateChangelog from '../step/prepare/updateChangelog.js';
import updateVersion from '../step/prepare/updateVersion.js';
import updateVersionMonorepo from '../step/prepare/updateVersionMonorepo.js';
import validate from '../step/prepare/validate.js';
import validatePreparationConditions from '../step/prepare/validatePreparationConditions.js';
import printDryRunBanner from '../step/printDryRunBanner.js';
import pull from '../step/pull.js';
import {
  arrayify,
  exitProcess,
  print,
  wrapExecWithDir,
} from '../util/index.js';

async function prepare({
  help = false,
  dir = '.',
  yes = false,
  firstRelease = false,
  releaseCount,
  dryRun = false,
  noBrowse = false,
  commitFrom,
  preid,
}) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
  }
  printDeprecated({ firstRelease, releaseCount });
  const prerelease = getPrerelease(preid);
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
      dir,
      prerelease,
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
      prerelease,
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
      prerelease,
      dir,
      dryRun,
    });

    const updateVersionFn = config.monorepo
      ? updateVersionMonorepo
      : updateVersion;
    await updateVersionFn({
      config,
      nextVersion,
      releaseType,
      prerelease,
      dir,
      dryRun,
    });
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
    prerelease,
    dir,
  });
  checkoutToStagingBranch({ stagingBranch, dir, dryRun });
  await commitChanges({
    nextVersion,
    releaseType,
    prerelease,
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
    prerelease,
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
  '--preid': String,

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

// `--preid beta` -> `{ preid: 'beta' }`, no `--preid` -> `null`
function getPrerelease(preid) {
  if (preid === undefined) {
    return null;
  }
  if (!/^[0-9A-Za-z-]+$/.test(preid) || preid === 'latest') {
    print(
      error(
        `Invalid --preid \`${preid}\`: use letters, digits or \`-\` (e.g. beta, alpha, rc, next), and not \`latest\`.`
      )
    );
    exitProcess(1);
  }
  return { preid };
}

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
