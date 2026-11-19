import { error, info } from '../../color.js';
import { exitProcess, print, wrapExecWithDir } from '../../util/index.js';
import runStep from '../runStep.js';

// The `version` hook returns `{ nextVersion }`, and can add
// `packages: [{ name, version }]` when it releases packages with independent
// versions (algolia/shipjs#986). `nextVersion` then defaults to the first
// package's version. Returning no version and no packages means there is
// nothing to release.
export default async ({ version, dir, prerelease = null, graduate = false }) =>
  await runStep({ title: 'Running the `version` hook.' }, async () => {
    const result =
      (await version({
        exec: wrapExecWithDir(dir),
        dir,
        prerelease,
        graduate,
      })) || {};
    const { packages = null } = result;
    if (packages !== null && !Array.isArray(packages)) {
      print(error('The `version` hook must return `packages` as an array.'));
      exitProcess(1);
      return {};
    }
    const nextVersion =
      result.nextVersion ||
      (packages && packages.length > 0 ? packages[0].version : null);
    if (!nextVersion) {
      print(info('Nothing to release!'));
      exitProcess(0);
      return {};
    }
    return { nextVersion, packages };
  });
