import { updateVersion } from 'shipjs-lib';
import runStep from '../runStep.js';
import { print, wrapExecWithDir } from '../../util/index.js';
import { info } from '../../color.js';

export default async ({ config, nextVersion, releaseType, dir, dryRun }) =>
  await runStep({ title: 'Updating the version.' }, async () => {
    const { versionUpdated } = config;
    if (dryRun) {
      print(`-> ${info('package.json')}`);
      if (versionUpdated) {
        print(`-> execute ${info('versionUpdated()')} callback.`);
      }
      return;
    }
    updateVersion({ nextVersion, dir });
    if (versionUpdated) {
      await versionUpdated({
        version: nextVersion,
        releaseType,
        dir,
        exec: wrapExecWithDir(dir),
      });
    }
  });
