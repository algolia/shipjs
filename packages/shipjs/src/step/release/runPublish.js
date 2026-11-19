import { expandPackageList } from 'shipjs-lib';

import { info } from '../../color.js';
import { getPublishCommand, getTagForDir } from '../../helper/index.js';
import { run, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({
  isYarn,
  config,
  releaseTag: tag,
  prereleaseTag = tag,
  prerelease = null,
  dir,
  dryRun,
}) =>
  runStep({ title: 'Publishing.' }, () => {
    const {
      publishCommand,
      monorepo,
      useOidcTokenProvider,
      generateProvenance,
    } = config;

    // This adds the following line to ~/.npmrc
    // > registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
    // Skip when using OIDC trusted publishing (e.g., GitHub Actions native npm publishing)
    if (!useOidcTokenProvider) {
      run({
        command: `npm config set "//registry.npmjs.org/:_authToken" "\\\${NPM_AUTH_TOKEN}"`,
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
          tag: getTagForDir(packageDir, { tag, prereleaseTag }),
          prereleaseTag,
          prerelease,
          dir: packageDir,
          generateProvenance,
        });
        if (command) {
          print(`Running the following at ${info(packageDir)}`);
          run({ command, dir: packageDir, dryRun });
        } else {
          print(`No publish command for ${info(packageDir)}`);
        }
      });
    } else {
      const command = getPublishCommand({
        isYarn,
        publishCommand,
        tag: getTagForDir(dir, { tag, prereleaseTag }),
        prereleaseTag,
        prerelease,
        dir,
        generateProvenance,
      });
      run({ command, dir, dryRun });
    }
  });
