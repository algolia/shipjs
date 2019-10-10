import { expandPackageList } from 'shipjs-lib';
import runStep from '../runStep';

export default ({ isYarn, config, releaseTag: tag, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, ({ run, print, info }) => {
    const { publishCommand, monorepo } = config;
    const defaultCommand = isYarn
      ? `yarn publish --no-git-tag-version --non-interactive --tag ${tag}`
      : `npm publish --tag ${tag}`;
    if (monorepo) {
      const { packagesToPublish } = monorepo;
      const packageList = expandPackageList(packagesToPublish, dir);
      packageList.forEach(packageDir => {
        const command = publishCommand({
          isYarn,
          tag,
          defaultCommand,
          dir: packageDir,
        });
        print(`Running the following at ${info(packageDir)}`);
        run({ command, dir: packageDir, dryRun });
      });
    } else {
      const command = publishCommand({ isYarn, tag, defaultCommand, dir });
      run({ command, dir, dryRun });
    }
  });
