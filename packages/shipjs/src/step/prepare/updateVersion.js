import { updateVersion } from 'shipjs-lib';
import runStep from '../runStep';
import { print, wrapExecWithDir } from '../../util';
import { info } from '../../color';

export default async ({ config, nextVersion, dir, dryRun }) =>
  await runStep({ title: 'Updating the version.' }, async () => {
    const { versionUpdated } = config;
    if (dryRun) {
      print(`-> ${info('package.json')}`);
      print(`-> execute ${info('versionUpdated()')} callback.`);
      return;
    }
    updateVersion(nextVersion, dir);
    await versionUpdated({
      version: nextVersion,
      dir,
      exec: wrapExecWithDir(dir),
    });
  });
