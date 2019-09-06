import { updateVersion } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';
import wrapExecWithDir from '../../util/wrapExecWithDir';

export default async ({ config, nextVersion, dir, dryRun }) =>
  await runStep({ title: 'Updating the version.' }, async ({ print, info }) => {
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
