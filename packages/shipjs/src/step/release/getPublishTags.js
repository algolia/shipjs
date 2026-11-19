import { getCurrentBranch, getPrereleaseId } from 'shipjs-lib';

import { error, info } from '../../color.js';
import {
  getPackagesToPublish,
  getTagForVersion,
  resolvePublishTags,
} from '../../helper/index.js';
import { exitProcess, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default async ({ config, version, releaseTag, dir }) =>
  await runStep({ title: 'Resolving the npm dist-tag.' }, async () => {
    const packages = await getPackagesToPublish({ config, dir });
    const versions =
      packages.length > 0 ? packages.map((pkg) => pkg.version) : [version];
    const preids = Array.from(
      new Set(versions.map(getPrereleaseId).filter(Boolean))
    );
    if (preids.length > 1) {
      print(
        error(
          `The packages to publish are on more than one prerelease channel: ${preids.join(
            ', '
          )}.`
        )
      );
      print('Release one channel at a time.');
      exitProcess(1);
    }
    const prerelease = preids.length === 1 ? { preid: preids[0] } : null;
    const branch = getCurrentBranch(dir);
    const tags = resolvePublishTags({
      config,
      version,
      releaseTag,
      prerelease,
      branch,
      packages,
    });

    if (packages.length > 0) {
      packages.forEach(({ name, version: packageVersion }) => {
        print(
          `  ${name}@${packageVersion} -> ${info(
            getTagForVersion(packageVersion, tags)
          )}`
        );
      });
    } else {
      print(`  ${version} -> ${info(getTagForVersion(version, tags))}`);
    }

    return { packages, prerelease, ...tags };
  });
