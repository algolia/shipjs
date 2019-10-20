import { expandPackageList, updateVersion } from 'shipjs-lib';
import runStep from '../runStep';
import { wrapExecWithDir, print } from '../../util';
import { info } from '../../color';

export default async ({ config, nextVersion, dir, dryRun }) =>
  await runStep(
    { title: 'Updating the versions on the monorepo.' },
    async () => {
      const {
        versionUpdated,
        monorepo: { packagesToBump },
      } = config;
      const packageList = expandPackageList(packagesToBump, dir);
      if (dryRun) {
        print(`Your configuration: ${JSON.stringify(packagesToBump)}`);
        print(`Actual packages to bump:`);
        packageList.forEach(packageDir =>
          print(`-> ${info(`${packageDir}/package.json`)}`)
        );
        print(`-> execute ${info('versionUpdated()')} callback.`);
        return;
      }
      packageList.forEach(packageDir => {
        print(`-> ${info(`${packageDir}/package.json`)}`);
        updateVersion(nextVersion, packageDir);
      });
      await versionUpdated({
        version: nextVersion,
        dir,
        exec: wrapExecWithDir(dir),
      });
    }
  );
