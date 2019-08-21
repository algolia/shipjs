import { updateVersion } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';
import wrapExecWithDir from '../../util/wrapExecWithDir';

export default async ({ config, nextVersion, dir, dryRun }) =>
  await runStep({ title: 'Updating the version.' }, async ({ print, info }) => {
    const { filesToBump, versionUpdated } = config;
    if (dryRun) {
      filesToBump.forEach(file => {
        print(`-> ${info(file)}`);
      });
      print(`-> execute ${info('versionUpdated()')} callback.`);
      return;
    }
    updateVersion(filesToBump, nextVersion, dir);
    await versionUpdated({
      version: nextVersion,
      dir,
      exec: wrapExecWithDir(dir),
    });
  });
