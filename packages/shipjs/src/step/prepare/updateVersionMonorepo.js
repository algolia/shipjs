import { expandPackageList, updateVersion } from 'shipjs-lib';
import runStep from '../runStep';
import { wrapExecWithDir, print } from '../../util';
import { info } from '../../color';

export default async ({ config, nextVersion, releaseType, dir, dryRun }) =>
  await runStep(
    { title: 'Updating the versions on the monorepo.' },
    async () => {
      const {
        versionUpdated,
        monorepo: { mainVersionFile, packagesToBump },
      } = config;
      const packageList = expandPackageList(packagesToBump, dir);
      if (dryRun) {
        print(`Your configuration: ${JSON.stringify(packagesToBump)}`);
        print(`Main version file: ${mainVersionFile}`);
        print(`Actual packages to bump:`);
        packageList.forEach(packageDir =>
          print(`-> ${info(`${packageDir}/package.json`)}`)
        );
        print(`-> execute ${info('versionUpdated()')} callback.`);
        return;
      }

      updateVersion({ nextVersion, dir, fileName: mainVersionFile });
      packageList.forEach(packageDir => {
        print(`-> ${info(`${packageDir}/package.json`)}`);
        updateVersion({ nextVersion, dir: packageDir });
      });
      await versionUpdated({
        version: nextVersion,
        type: releaseType,
        dir,
        exec: wrapExecWithDir(dir),
      });
    }
  );
