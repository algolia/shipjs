import { expandPackageList } from 'shipjs-lib';
import runStep from '../runStep';
import { run, print } from '../../util';
import { getPublishCommand } from '../../helper';
import { info } from '../../color';

export default ({ isYarn, config, releaseTag: tag, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, () => {
    const { publishCommand, monorepo } = config;

    if (isYarn) {
      print('Configuring the registry to https://registry.npmjs.org/');
      run({
        command: 'yarn config set registry https://registry.npmjs.org/',
        dir,
        dryRun,
      });
    }

    if (monorepo) {
      const { packagesToPublish } = monorepo;
      const packageList = expandPackageList(packagesToPublish, dir);
      packageList.forEach((packageDir) => {
        const command = getPublishCommand({
          isYarn,
          publishCommand,
          tag,
          dir: packageDir,
        });
        if (command) {
          print(`Running the following at ${info(packageDir)}`);
          run({ command, dir: packageDir, dryRun });
        } else {
          print(`No publish command for ${info(packageDir)}`);
        }
      });
    } else {
      const command = getPublishCommand({ isYarn, publishCommand, tag, dir });
      run({ command, dir, dryRun });
    }
  });
