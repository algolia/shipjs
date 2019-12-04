import { updateVersion } from 'shipjs-lib';
import runStep from '../runStep';
import { print, wrapExecWithDir } from '../../util';
import { info } from '../../color';

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
