import { expandPackageList } from 'shipjs-lib';
import runStep from '../runStep';
import { run, print } from '../../util';
import { getPublishCommand } from '../../helper';
import { info } from '../../color';

export default ({ isYarn, config, releaseTag: tag, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, () => {
    const { publishCommand, monorepo } = config;

    // This adds the following line to ~/.npmrc
    // > registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
    run({
      command: `npm config set "//registry.npmjs.org/:_authToken" "\\\${NPM_AUTH_TOKEN}"`,
      dir,
      dryRun,
    });

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
