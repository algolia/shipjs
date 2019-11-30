import { expandPackageList } from 'shipjs-lib';
import runStep from '../runStep';
import { run, print } from '../../util';
import { getPublishCommand } from '../../helper';
import { info } from '../../color';

export default ({ isYarn, config, releaseTag: tag, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, () => {
    const { publishCommand, monorepo } = config;

    if (monorepo) {
      const { packagesToPublish } = monorepo;
      const packageList = expandPackageList(packagesToPublish, dir);
      packageList.forEach(packageDir => {
        const command = getPublishCommand({
          isYarn,
          publishCommand,
          tag,
          dir: packageDir,
        });
        print(`Running the following at ${info(packageDir)}`);
        run({ command, dir: packageDir, dryRun });
      });
    } else {
      const command = getPublishCommand({ isYarn, publishCommand, tag, dir });
      run({ command, dir, dryRun });
    }
  });
